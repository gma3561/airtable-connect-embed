interface BadgeProps {
  text: string | null;
  variant?: "status" | "type" | "agent" | "default";
}

const Badge = ({ text, variant = "default" }: BadgeProps) => {
  if (!text) return null;
  
  // Determine background color based on variant and text content
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  
  if (variant === "status") {
    switch (text) {
      case "거래가능":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "계약중":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "거래완료":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      case "보류":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
    }
  } else if (variant === "type") {
    bgColor = "bg-indigo-100";
    textColor = "text-indigo-800";
  } else if (variant === "agent") {
    bgColor = "bg-purple-100";
    textColor = "text-purple-800";
  }
  
  return (
    <span className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {text}
    </span>
  );
};

export default Badge;