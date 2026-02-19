import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
    content: string;
    children: ReactNode;
}

export default function Tooltip({ content, children }: Props) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setVisible(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div
            ref={ref}
            className="relative inline-block max-w-full"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onClick={() => setVisible((v) => !v)}
        >
            {children}

            {visible && (
                <div
                    className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            z-[9999]
            bg-gray-700 text-white text-xs
            px-3 py-2 rounded-md shadow-xl
            max-w-xs break-words text-center
          "
                >
                    {content}
                </div>
            )}
        </div>
    );
}
