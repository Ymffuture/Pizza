import { useState, useMemo } from "react";
import { FiBook, FiCheckCircle } from "react-icons/fi";

const SUBJECT_PRICES = {
  mathematics: 320,
  mathLit: 280,
  physics: 320,
  lifeScience: 220,
};

const SUBJECT_LABELS = {
  mathematics: "Mathematics",
  mathLit: "Mathematical Literacy",
  physics: "Physics",
  lifeScience: "Life Sciences",
};

export default function SubjectsPricingPage() {
  const [selected, setSelected] = useState([]);

  const toggleSubject = (key) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((s) => s !== key)
        : [...prev, key]
    );
  };

  const { subtotal, discount, total } = useMemo(() => {
    const subtotal = selected.reduce(
      (sum, subject) => sum + SUBJECT_PRICES[subject],
      0
    );

    const discount = selected.length > 1 ? subtotal * 0.03 : 0;
    const total = subtotal - discount;

    return { subtotal, discount, total };
  }, [selected]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">School Subjects Pricing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(SUBJECT_PRICES).map((key) => (
          <div
            key={key}
            onClick={() => toggleSubject(key)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selected.includes(key)
                ? "bg-blue-50 border-blue-400"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiBook />
                <span className="font-medium">
                  {SUBJECT_LABELS[key]}
                </span>
              </div>
              {selected.includes(key) && (
                <FiCheckCircle className="text-blue-600" />
              )}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              R {SUBJECT_PRICES[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-xl space-y-2">
        <p>Subtotal: <strong>R {subtotal.toFixed(2)}</strong></p>
        <p>
          Discount (3%):{" "}
          <strong className="text-green-600">
            - R {discount.toFixed(2)}
          </strong>
        </p>
        <p className="text-lg font-semibold">
          Total: R {total.toFixed(2)}
        </p>
      </div>

      {selected.length > 1 && (
        <p className="text-sm text-green-600">
          🎉 You qualify for a 3% bundle discount!
        </p>
      )}
    </div>
  );
}
