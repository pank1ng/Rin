import { useEffect, useRef, useState } from "react"
import { Helmet } from 'react-helmet'
import { useTranslation } from "react-i18next"
import { FeedCard } from "../components/feed_card"
import { Waiting } from "../components/loading"
import { client } from "../main"
import { headersWithAuth } from "../utils/auth"
import { siteName } from "../utils/constants"
import { usePageBodyClass } from "../hooks/usePageBodyClass";

type FeedsData = {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    feeds: {
        hashtags: {
            name: string;
            id: number;
        }[];
        id: number;
        title: string | null;
        summary: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: number;
            username: string;
            avatar: string | null;
        };
    }[] | undefined;
}

export function HashtagPage({ name }: { name: string }) {
    const { t } = useTranslation()
    usePageBodyClass("liquid-page")
    const [status, setStatus] = useState<'loading' | 'idle'>('idle')
    const [hashtag, setHashtag] = useState<FeedsData>()
    const ref = useRef("")
    function fetchFeeds() {
        const nameDecoded = decodeURI(name)
        client.tag({ name: nameDecoded }).get({
            headers: headersWithAuth()
        }).then(({ data }) => {
            if (data && typeof data !== 'string') {
                setHashtag(data)
                setStatus('idle')
            }
        })
    }
    useEffect(() => {
        if (ref.current === name) return
        setStatus('loading')
        fetchFeeds()
        ref.current = name
    }, [name])
    return (
        <>
            <Helmet>
                <title>{`${hashtag?.name} - ${process.env.NAME}`}</title>
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={hashtag?.name} />
                <meta property="og:image" content={process.env.AVATAR} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={document.URL} />
            </Helmet>
            <Waiting for={hashtag || status === 'idle'}>
                <main className="w-full flex flex-col justify-center items-center mb-8">
                    <div className="wauto text-start py-6">
                        <div className="glass-card liquid-surface px-6 py-7 md:px-8 md:py-8 overflow-hidden relative">
                            <div className="pointer-events-none absolute inset-x-[12%] top-[-3.5rem] h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.75),rgba(255,255,255,0))] opacity-70 blur-2xl dark:opacity-20"></div>
                            <p className="ios-kicker mb-4">
                                Tag View
                            </p>
                            <p className="ios-title">
                                {hashtag?.name}
                            </p>
                            <div className="flex flex-row justify-between mt-5">
                                <p className="text-sm t-secondary font-normal">
                                    {t('article.total$count', { count: hashtag?.feeds?.length })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Waiting for={status === 'idle'}>
                        <div className="wauto flex flex-col liquid-stack">
                            {hashtag?.feeds?.map(({ id, ...feed }: any) => (
                                <FeedCard key={id} id={id} {...feed} />
                            ))}
                        </div>
                    </Waiting>
                </main>
            </Waiting>
        </>
    )
}
