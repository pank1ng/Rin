import {Link} from "wouter";
import {useTranslation} from "react-i18next";
import {timeago} from "../utils/timeago";
import {HashTag} from "./hashtag";
import {useMemo} from "react";

export function FeedCard({ id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt }:
    {
        id: string, avatar?: string,
        draft?: number, listed?: number, top?: number,
        title: string, summary: string,
        hashtags: { id: number, name: string }[],
        createdAt: Date, updatedAt: Date
    }) {
    const { t } = useTranslation()
    return useMemo(() => (
        <>
            <Link href={`/feed/${id}`} target="_blank" className="w-full glass-card my-3 p-6 md:p-7 duration-300 bg-button block">
                {avatar &&
                    <div className="flex flex-row items-center mb-5 rounded-[24px] overflow-clip">
                        <img src={avatar} alt=""
                            className="object-cover object-center w-full max-h-[28rem] hover:scale-[1.03] translation duration-500" />
                    </div>}
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex flex-wrap gap-2">
                        {draft === 1 && <span className="ios-pill text-xs">{t("draft")}</span>}
                        {listed === 0 && <span className="ios-pill text-xs">{t("unlisted")}</span>}
                        {top === 1 && <span className="rounded-full px-4 py-2 text-xs font-medium bg-theme/12 text-theme">{t('article.top.title')}</span>}
                    </div>
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Article</span>
                </div>
                <h1 className="text-[1.65rem] md:text-[1.9rem] font-semibold t-primary tracking-[-0.04em] text-pretty overflow-hidden">
                    {title}
                </h1>
                <p className="space-x-2 mt-2">
                    <span className="text-slate-400 text-sm" title={new Date(createdAt).toLocaleString()}>
                        {createdAt === updatedAt ? timeago(createdAt) : t('feed_card.published$time', { time: timeago(createdAt) })}
                    </span>
                    {createdAt !== updatedAt &&
                        <span className="text-slate-400 text-sm" title={new Date(updatedAt).toLocaleString()}>
                            {t('feed_card.updated$time', { time: timeago(updatedAt) })}
                        </span>
                    }
                </p>
                <p className="text-pretty overflow-hidden t-secondary mt-4 leading-7">
                    {summary}
                </p>
                {hashtags.length > 0 &&
                    <div className="mt-5 flex flex-row flex-wrap justify-start gap-2">
                        {hashtags.map(({ name }, index) => (
                            <HashTag key={index} name={name} />
                        ))}
                    </div>
                }

            </Link>
        </>
    ), [id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt])
}
