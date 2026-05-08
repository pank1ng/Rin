import { useLocation } from "wouter"

export function HashTag({ name }: { name: string }) {
    const [_, setLocation] = useLocation()
    return (
        <button onClick={(e) => { e.preventDefault(); setLocation(`/hashtag/${name}`) }}
            className="text-base t-secondary hover:text-theme text-pretty overflow-hidden bg-secondary rounded-full px-3 py-1.5 bg-button" >
            <div className="flex gap-0.5 items-center">
                <div className="text-sm opacity-70 italic">#</div>
                <div className="text-sm opacity-90">
                    {name}
                </div>
            </div>
        </button >
    )
}
