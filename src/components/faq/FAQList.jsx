import FAQItem from "./FAQItem";

export default function FAQList({ items }) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <FAQItem
          key={item.id}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </div>
  );
}
