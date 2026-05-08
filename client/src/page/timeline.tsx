import {useEffect, useRef, useState} from "react"
import {Helmet} from 'react-helmet'
import {Link} from "wouter"
import {Waiting} from "../components/loading"
import {client} from "../main"
import {headersWithAuth} from "../utils/auth"
import {siteName} from "../utils/constants"
import {useTranslation} from "react-i18next";
import { useLiquidSurface } from "../hooks/useLiquidSurface";

interface FeedItem {
    id: number;
    createdAt: Date;
    title: string | null;
}

export function TimelinePage() {
    const [feeds, setFeeds] = useState<Partial<Record<number, FeedItem[]>>>()
    const [length, setLength] = useState(0)
    const ref = useRef(false)
    const { t } = useTranslation()
    function fetchFeeds() {
        client.feed.timeline.get({
            headers: headersWithAuth()
        })
        .then(({ data }) => {
            if (data && typeof data !== 'string') {
                const arr = Array.isArray(data) ? data : []
                setLength(arr.length)
                const groups = arr.reduce<Record<number, FeedItem[]>>((acc, item) => {
                    const key = new Date(item.createdAt).getFullYear()
                    ;(acc[key] ||= []).push(item)
                    return acc
                }, {})

                setFeeds(groups)
            }
        })
        .catch(err => {
            console.error("fetchFeeds error:", err)
        })
    }

    useEffect(() => {
        if (ref.current) return
        fetchFeeds()
        ref.current = true
    }, [])
    return (
        <>
            <Helmet>
                <title>{`${t('timeline')} - ${process.env.NAME}`}</title>
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={t('timeline')} />
                <meta property="og:image" content={process.env.AVATAR} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={document.URL} />
            </Helmet>
            <Waiting for={feeds}>
                <main className="w-full flex flex-col justify-center items-center mb-8 ani-show">
                    <div className="wauto text-start py-6">
                        <p className="ios-kicker mb-4">
                            Archive
                        </p>
                        <p className="ios-title">
                            {t('timeline')}
                        </p>
                        <div className="flex flex-row justify-between mt-5">
                            <p className="text-sm t-secondary font-normal">
                                {t('article.total$count', { count: length })}
                            </p>
                        </div>
                    </div>
                    {feeds && Object.keys(feeds).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
                        <div key={year} className="wauto flex flex-col justify-center items-start glass-card p-6 md:p-8 mb-4">
                            <h1 className="flex flex-row items-center space-x-2">
                                <span className="text-2xl font-bold t-primary ">
                                    {t('year$year', { year: year })}
                                </span>
                                <span className="text-sm t-secondary">
                                    {t('article.total_short$count', { count: feeds[+year]?.length })}
                                    </span>
                            </h1>
                            <div className="w-full flex flex-col justify-center items-start my-4 liquid-stack">
                                {feeds[+year]?.map(({ id, title, createdAt }) => (
                                    <FeedItem key={id} id={id.toString()} title={title || t('unlisted')}
                                              createdAt={new Date(createdAt)}/>
                                ))}
                            </div>
                        </div>
                    ))}
                </main>
            </Waiting>
        </>
    )
}

export function FeedItem({ id, title, createdAt }: { id: string, title: string, createdAt: Date }) {
    const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit' });
    const liquid = useLiquidSurface();
    return (
        <div className="flex flex-row pl-2">
            <div className="flex flex-row items-center">
                <div className="w-2.5 h-2.5 bg-theme rounded-full shadow-[0_0_18px_rgba(10,132,255,0.48)]"></div>
            </div>
            <div
                className="flex-1 rounded-[20px] m-2 duration-300 flex flex-row items-center space-x-4 px-4 py-3 bg-secondary bg-button liquid-surface"
                {...liquid}
            >
                <span className="t-secondary text-sm" title={new Date(createdAt).toLocaleString()}>
                    {formatter.format(new Date(createdAt))}
                </span>
                <Link href={`/feed/${id}`} target="_blank" className="text-base t-primary hover:text-theme text-pretty overflow-hidden">
                    {title}
                </Link>
            </div>
        </div>
    )
}
