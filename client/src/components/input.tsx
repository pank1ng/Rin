
export function Input({ autofocus, value, setValue, className, placeholder, onSubmit }:
    { autofocus?: boolean, value: string, className?: string, placeholder: string, id?: number, setValue: (v: string) => void, onSubmit?: () => void }) {
    return (<input
        autoFocus={autofocus}
        placeholder={placeholder}
        value={value}
        onKeyDown={(event) => {
            if (event.key === 'Enter' && onSubmit) {
                onSubmit()
            }
        }}
        onChange={(event) => {
            setValue(event.target.value)
        }}
        className={'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40 w-full py-3 px-4 rounded-[20px] bg-secondary t-primary placeholder:text-slate-400 dark:placeholder:text-slate-500 ' + className} />
    )
}
export function Checkbox({ value, setValue, className, placeholder }:
    { value: boolean, className?: string, placeholder: string, id: string, setValue: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (<input type='checkbox'
        placeholder={placeholder}
        checked={value}
        onChange={(event) => {
            setValue(event.target.checked)
        }}
        className={className} />
    )
}
