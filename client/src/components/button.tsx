import ReactLoading from "react-loading";

export function Button({ title, onClick, secondary = false }: { title: string, secondary?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`${secondary ? "bg-secondary t-primary" : "bg-theme text-white hover:bg-theme-hover active:bg-theme-active shadow-[0_16px_36px_rgba(10,132,255,0.28)]"} text-nowrap rounded-full px-5 py-2.5 h-min font-medium bg-button`}
        >
            {title}
        </button>
    );
}

export function ButtonWithLoading({ title, onClick, loading, secondary = false }: { title: string, secondary?: boolean, loading: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`${secondary ? "bg-secondary t-primary" : "bg-theme text-white hover:bg-theme-hover active:bg-theme-active shadow-[0_16px_36px_rgba(10,132,255,0.28)]"} text-nowrap rounded-full px-5 py-2.5 h-min space-x-2 flex flex-row items-center font-medium bg-button`}
        >
            {loading && <ReactLoading width="1em" height="1em" type="spin" color="#FFF" />}
            <span>
                {title}
            </span>
        </button>
    );
}
