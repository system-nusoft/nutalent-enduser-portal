import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../button/Button";
import style from "./style.module.scss";
export const Accordian = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();
  const values = [
    {
      label: t("accordian.feedbackFrom"),
      description:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
      answer:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
      button: true,
    },
    {
      label: t("accordian.projectCreation"),
      description:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
      answer:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
    },
    {
      label: t("accordian.schedulingInterview"),
      description:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
      answer:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
    },
    {
      label: t("accordian.candidates"),
      description:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
      answer:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
    },
    {
      label: t("accordian.profileSettings"),
      description:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
      answer:
        "loLorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus corrupti accusantium labore, iusto eius modi vel tenetur eligendi dolorum iste distinctio. Libero consequuntur saepe repellendus. Repellendus in aliquid quae et.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(
      openIndex === index
        ? values?.length - 1 === index
          ? 0
          : index + 1
        : index
    );
  };

  return (
    <div className="mt-10 px-36 flex flex-col gap-10 pb-10">
      <div className="grid grid-cols-5 gap-6 text-center justify-around">
        {values?.map(({ label }, index) => (
          <div
            onClick={() => setOpenIndex(index)}
            className={`${
              index === openIndex ? style.selected : style.unSelected
            } p-3 rounded-3xl   cursor-pointer`}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        id="accordion-flush"
        data-accordion="collapse"
        data-active-classes="bg-red dark:bg-gray-900 text-gray-900 dark:text-white"
        data-inactive-classes="text-gray-500 dark:text-gray-400"
        className="flex flex-col gap-5"
      >
        {values.map(({ label, description, answer, button }, index) => (
          <div
            key={index}
            className="flex flex-col gap-10 bg-white rounded-2xl px-10 py-2 border "
          >
            <h1 id={`accordion-flush-heading-${index}`}>
              <button
                type="button"
                onClick={() => handleToggle(index)}
                className="flex items-center justify-between w-full py-5  z-0 font-medium rtl:text-right text-gray-500  dark:text-gray-400 gap-3"
                aria-expanded={openIndex === index}
                aria-controls={`accordion-flush-body-${index}`}
              >
                <span className={style.heading}>{label}</span>

                {openIndex === index && button ? (
                  <div className="z-10">
                    <Button label="Send" btn_class="white_btn" />
                  </div>
                ) : (
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                )}
              </button>
              <div
                className={`${style.description} ${
                  openIndex !== index && "hidden"
                }`}
              >
                {description}
              </div>
            </h1>

            <div
              id={`accordion-flush-body-${index}`}
              className={
                openIndex === index
                  ? "p-5 border mb-5 border-zinc-300 rounded-2xl "
                  : "hidden"
              }
              aria-labelledby={`accordion-flush-heading-${index}`}
            >
              <div className={style.answer}>{answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
