import { CheckIcon, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface OptionsProps {
  value: string;
  label: string;
  active: boolean;
}

interface SelectProps {
  icon?: React.ReactNode;
  options: OptionsProps[];
  actualValue?: string;
  className?: string;
  classNameIcon?: string;
  classNameText?: string;
  classsNameContainer?: string;
  direction?: "top" | "bottom";
  onChange?: ({ value, label }: OptionsProps) => void;
}

export default function Select({
  icon,
  options,
  className,
  actualValue,
  classsNameContainer,
  classNameIcon,
  classNameText,
  direction = "bottom",
  onChange,
}: SelectProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [heightContainer, setHeightContainer] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const refContainer = useRef<HTMLDivElement>(null);
  const refOptions = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (isAnimating) return;

    if (refOptions.current) {
      const ref = refOptions.current;
      if (!(ref instanceof HTMLElement)) return;
      setIsAnimated(false);
      setIsAnimating(true);

      ref.addEventListener("transitionend", () => {
        setIsOpen(false);
        setIsAnimating(false);
        ref.removeEventListener("transitionend", () => {
          setIsOpen(false);
          setIsAnimating(false);
        });
      });
    } else {
      setIsOpen(true);
      setTimeout(() => {
        setIsAnimated(true);
      }, 100);
    }
  };

  useEffect(() => {
    if (!refContainer.current) return;
    setHeightContainer(refContainer.current.offsetHeight);

    return () => {
      setHeightContainer(0);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isAnimating) return;

      if (!refContainer.current || !refOptions.current) return;

      if (
        !refOptions.current.contains(event.target as Node) &&
        !refContainer.current.contains(event.target as Node)
      ) {
        setIsAnimated(false);
        setIsAnimating(true);

        refOptions.current.addEventListener("transitionend", () => {
          setIsOpen(false);
          setIsAnimating(false);
          refOptions.current?.removeEventListener("transitionend", () => {
            setIsOpen(false);
            setIsAnimating(false);
          });
        });
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [refOptions, refContainer]);

  const onChangeOption = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    const optionValue = e.currentTarget.getAttribute("data-value");
    const optionLabel = e.currentTarget.getAttribute("data-label");
    const optionActive = e.currentTarget.getAttribute("data-active");

    if (!optionValue || !optionLabel || !optionActive) return;

    if (onChange)
      onChange({
        value: optionValue,
        label: optionLabel,
        active: optionActive === "true",
      });

    if (refOptions.current) {
      setIsAnimated(false);
      setIsAnimating(true);

      refOptions.current.addEventListener("transitionend", () => {
        setIsOpen(false);
        setIsAnimating(false);
        refOptions.current?.removeEventListener("transitionend", () => {
          setIsOpen(false);
          setIsAnimating(false);
        });
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-center ${classsNameContainer} relative z-[100]`}
    >
      <div
        ref={refContainer}
        className={`flex items-center justify-start px-3 h-[2.125rem] min-w-[10rem] gap-2 cursor-pointer transition-colors duration-300 ease-out 5 hover:bg-white/15 bg-white/10 backdrop-blur ${className} rounded-full `}
        onClick={handleOpen}
      >
        {icon && icon}
        <span
          className={`text-white text-[1rem] font-normal leading-[0] ${classNameText} mt-[2px] pointer-events-none cursor-default font-geistSans`}
        >
          {actualValue}
        </span>
        <ChevronDown
          className={`size-[1.25rem] text-white pointer-events-none ml-auto cursor-default ${classNameIcon}`}
          absoluteStrokeWidth
          strokeWidth={1.5}
        />
      </div>
      {isOpen && (
        <div
          ref={refOptions}
          className={`${
            isAnimated ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 ease-out absolute z-50 w-full bg-neutral-800 border border-white/10 rounded-lg p-1 gap-1 flex flex-col max-h-[13rem] overflow-y-auto hide-scrollbar backdrop-blur`}
          style={{
            clipPath: "inset(0 0 0 0 round 8px)",
            top:
              direction === "top"
                ? `calc(${heightContainer}px + 0.375rem)`
                : undefined,
            bottom:
              direction === "bottom"
                ? `calc(${heightContainer}px + 0.375rem)`
                : undefined,
          }}
        >
          {options.map((option) => (
            <div
              data-value={option.value}
              data-label={option.label}
              data-active={option.active}
              key={option.value}
              onClick={onChangeOption}
              className={`flex items-center justify-start px-2 !min-h-[2.155rem] w-full gap-2 cursor-pointer transition-colors duration-300 ease-out hover:bg-white/5 ${
                option.active ? "bg-white/10 pointer-events-none" : ""
              } ${className} rounded-lg`}
            >
              <span
                className={`mt-[1px] text-white text-[1rem] font-normal leading-[0] ${classNameText} pointer-events-none`}
              >
                {option.label}
              </span>
              {option.active && (
                <CheckIcon
                  className="size-[1.25rem] ml-auto pointer-events-none"
                  absoluteStrokeWidth
                  strokeWidth={2}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
