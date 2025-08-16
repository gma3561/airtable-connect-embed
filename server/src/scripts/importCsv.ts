import { config } from 'dotenv';
config({ path: '.env' });
import { createReadStream } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse';

// Column header mapping from CSV (Korean) to DB columns
const HEADER_TO_DB: Record<string, string> = {
  '등록일': 'registration_date',
  '공유여부': 'shared_status',
  '담당자': 'agent',
  '매물상태': 'property_status',
  '재등록사유': 'reregistration_reason',
  '매물종류': 'property_type',
  '매물명': 'property_name',
  '동': 'building_dong',
  '호': 'building_ho',
  '소재지': 'address',
  '거래유형': 'transaction_type',
  '금액': 'price',
  '계약기간': 'contract_period',
  '임차금액': 'rental_amount',
  '임차유형': 'rental_type',
  '거주자': 'resident',
  '거래완료날짜': 'completion_date',
  '담당자MEMO': 'agent_memo',
  '특이사항': 'special_notes'
  // 사진/영상/문서 등은 차후 매핑 시 확장
};

function isTruthy(value: string | null | undefined): boolean | null {
  if (value == null) return null;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === '') return null;
  return ['true', '1', 'y', 'yes', 't', 'o', 'on', '예', 'true'].includes(normalized);
}

function parseDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;
  // Normalize common formats to YYYY-MM-DD
  // 1) 2021-12-29
  const iso = v.match(/^\d{4}-\d{2}-\d{2}$/);
  if (iso) return v;
  // 2) 2021.12.29 or 2021.12.9
  const dot = v.match(/^(\d{4})[.](\d{1,2})[.](\d{1,2})/);
  if (dot) {
    const y = dot[1] ?? '';
    const m = (dot[2] ?? '').padStart(2, '0');
    const d = (dot[3] ?? '').padStart(2, '0');
    if (y && m && d) return `${y}-${m}-${d}`;
  }
  // 3) 2014.01 /네이버 1992년 01월 31일 -> try to extract first YYYY.MM.DD or YYYY년 M월 D일
  const kor = v.match(/(\d{4})\s*[년.\/-]\s*(\d{1,2})\s*[월.\/-]\s*(\d{1,2})/);
  if (kor) {
    const y = kor[1] ?? '';
    const m = (kor[2] ?? '').padStart(2, '0');
    const d = (kor[3] ?? '').padStart(2, '0');
    if (y && m && d) return `${y}-${m}-${d}`;
  }
  return null; // keep as null if not a clean date-only field
}

function mapRecordToDbRow(record: Record<string, any>): Record<string, any> {
  const row: Record<string, any> = {};
  for (const [csvHeader, dbField] of Object.entries(HEADER_TO_DB)) {
    if (record[csvHeader] === undefined) continue;
    let value: any = record[csvHeader];

    if (dbField === 'shared_status') {
      value = isTruthy(value);
    } else if (dbField === 'registration_date') {
      value = parseDateOnly(value);
    } else {
      // Keep text fields as-is (trim trailing/leading whitespace)
      if (typeof value === 'string') {
        value = value.trim();
      }
    }

    row[dbField] = value === '' ? null : value;
  }
  return row;
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name: string): string | undefined => {
    const key = `--${name}`;
    const idx = args.indexOf(key);
    if (idx >= 0) {
      const next = args[idx + 1];
      if (typeof next === 'string' && !next.startsWith('--')) return next;
    }
    return undefined;
  };

  const filePath = getArg('file') || getArg('f') || args.find((a) => a.endsWith('.csv'));
  const dryRun = args.includes('--dry-run');
  const batchSize = Number(getArg('batch') || 500);

  if (!filePath) {
    console.error('Usage: tsx src/scripts/importCsv.ts --file "/path/to/file.csv" [--dry-run] [--batch 500]');
    process.exit(1);
  }

  const absPath = resolve(process.cwd(), filePath);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
    process.exit(1);
  }

  const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
    db: { schema: 'public' }
  });

  console.log(`Starting CSV import: ${basename(absPath)} (dryRun=${dryRun}, batch=${batchSize})`);

  const parser = createReadStream(absPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      bom: true
    })
  );

  let totalRead = 0;
  let totalInserted = 0;
  let batch: Record<string, any>[] = [];

  for await (const record of parser) {
    totalRead += 1;
    const mapped = mapRecordToDbRow(record);
    batch.push(mapped);

    if (batch.length >= batchSize) {
      if (!dryRun) {
        const { error, count } = await client.from('properties').insert(batch, { count: 'exact' });
        if (error) {
          console.error(`Insert error after ${totalInserted} rows:`, error.message);
          process.exit(1);
        }
        totalInserted += count ?? batch.length;
      }
      batch = [];
      if (totalRead % 1000 === 0) {
        console.log(`Progress: read=${totalRead}, inserted=${totalInserted}`);
      }
    }
  }

  if (batch.length > 0 && !dryRun) {
    const { error, count } = await client.from('properties').insert(batch, { count: 'exact' });
    if (error) {
      console.error(`Final insert error after ${totalInserted} rows:`, error.message);
      process.exit(1);
    }
    totalInserted += count ?? batch.length;
  }

  if (dryRun) {
    console.log(`Dry run completed. Read ${totalRead} rows. No data inserted.`);
  } else {
    console.log(`Import completed. Read ${totalRead} rows. Inserted ~${totalInserted} rows.`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
