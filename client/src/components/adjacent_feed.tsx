import {useEffect, useState} from "react";
import {client} from "../main.tsx";
import {timeago} from "../utils/timeago.ts";
import {Link} from "wouter";
import {useTranslation} from "react-i18next";
import { useLiquidSurface } from "../hooks/useLiquidSurface.ts";

export type AdjacentFeed = {
    id: number;
    title: string | null;
    summary: string;
    hashtags: {
        id: number;
        name: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
};
export type AdjacentFeeds = {
    nextFeed: AdjacentFeed | null;
    previousFeed: AdjacentFeed | null;
};

export function AdjacentSection({id, setError}: { id: string, setError: (error: string) => void }) {
    const [adjacentFeeds, setAdjacentFeeds] = useState<AdjacentFeeds>();

    useEffect(() => {
        client.feed
            .adjacent({id})
            .get()
            .then(({data, error}) => {
                if (error) {
                    setError(error.value as string);
                } else if (data && typeof data !== "string") {
                    setAdjacentFeeds(data);
                }
            });
    }, [id, setError]);
    return (
        <div className="glass-card liquid-stack m-2 grid grid-cols-1 sm:grid-cols-2 overflow-hidden">
            <AdjacentCard data={adjacentFeeds?.previousFeed} type="previous"/>
            <AdjacentCard data={adjacentFeeds?.nextFeed} type="next"/>
        </div>
    )
}

export function AdjacentCard({data, type}: { data: AdjacentFeed | null | undefined, type: "previous" | "next" }) {
    const direction = type === "previous" ? "text-start" : "text-end"
    const radius = type === "previous" ? "rounded-t-2xl sm:rounded-none sm:rounded-l-2xl" : "rounded-b-2xl sm:rounded-none sm:rounded-r-2xl"
    const {t} = useTranslation()
    const liquid = useLiquidSurface();
    if (!data) {
        return (<div className={`w-full p-6 duration-300 ${radius}`}>
            <p className={`t-secondary w-full ${direction}`}>
                {type === "previous" ? "Previous" : "Next"}
            </p>
            <h1 className={`text-xl font-semibold t-primary text-pretty truncate mt-2 ${direction}`}>
                {t('no_more')}
            </h1>
        </div>);
    }
    return (
        <Link href={`/feed/${data.id}`} target="_blank"
              className={`w-full p-6 duration-300 bg-button liquid-surface ${radius}`}
              {...liquid}>
            <p className={`t-secondary w-full ${direction}`}>
                {type === "previous" ? "Previous" : "Next"}
            </p>
            <h1 className={`text-xl font-semibold t-primary text-pretty truncate mt-2 ${direction}`}>
                {data.title}
            </h1>
            <p className={`space-x-2 mt-2 ${direction}`}>
                <span className="text-slate-400 text-sm" title={new Date(data.createdAt).toLocaleString()}>
                    {data.createdAt === data.updatedAt ? timeago(data.createdAt) : t('feed_card.published$time', {time: timeago(data.createdAt)})}
                </span>
                {data.createdAt !== data.updatedAt &&
                    <span className="text-slate-400 text-sm" title={new Date(data.updatedAt).toLocaleString()}>
                        {t('feed_card.updated$time', {time: timeago(data.updatedAt)})}
                    </span>
                }
            </p>
        </Link>
    )
}
