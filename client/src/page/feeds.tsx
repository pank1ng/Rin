import { useContext, useEffect, useRef, useState } from "react"
import { Helmet } from 'react-helmet'
import { Link, useSearch } from "wouter"
import { FeedCard } from "../components/feed_card"
import { Waiting } from "../components/loading"
import { client } from "../main"
import { ProfileContext } from "../state/profile"
import { headersWithAuth } from "../utils/auth"
import { siteName } from "../utils/constants"
import { tryInt } from "../utils/int"
import { useTranslation } from "react-i18next";

type FeedsData = {
    size: number,
    data: any[],
    hasNext: boolean
}

type FeedType = 'draft' | 'unlisted' | 'normal'

type FeedsMap = {
    [key in FeedType]: FeedsData
}

export function FeedsPage() {
    const { t } = useTranslation()
    const query = new URLSearchParams(useSearch());
    const profile = useContext(ProfileContext);
    const [listState, _setListState] = useState<FeedType>(query.get("type") as FeedType || 'normal')
    const [status, setStatus] = useState<'loading' | 'idle'>('idle')
    const [feeds, setFeeds] = useState<FeedsMap>({
        draft: { size: 0, data: [], hasNext: false },
        unlisted: { size: 0, data: [], hasNext: false },
        normal: { size: 0, data: [], hasNext: false }
    })
    const page = tryInt(1, query.get("page"))
    const limit = tryInt(10, query.get("limit"), process.env.PAGE_SIZE)
    const ref = useRef("")
    function fetchFeeds(type: FeedType) {
        client.feed.index.get({
            query: {
                page: page,
                limit: limit,
                type: type
            },
            headers: headersWithAuth()
        }).then(({ data }) => {
            if (data && typeof data !== 'string') {
                setFeeds({
                    ...feeds,
                    [type]: data
                })
                setStatus('idle')
            }
        })
    }
    useEffect(() => {
        const key = `${query.get("page")} ${query.get("type")}`
        if (ref.current == key) return
        const type = query.get("type") as FeedType || 'normal'
        if (type !== listState) {
            _setListState(type)
        }
        setStatus('loading')
        fetchFeeds(type)
        ref.current = key
    }, [query.get("page"), query.get("type")])
    return (
        <>
            <Helmet>
                <title>{`${t('article.title')} - ${process.env.NAME}`}</title>
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={t('article.title')} />
                <meta property="og:image" content={process.env.AVATAR} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={document.URL} />
            </Helmet>
            <Waiting for={feeds.draft.size + feeds.normal.size + feeds.unlisted.size > 0 || status === 'idle'}>
                <main className="w-full flex flex-col justify-center items-center mb-8">
                    <div className="wauto text-start py-6">
                        <div className="glass-card liquid-surface px-6 py-7 md:px-8 md:py-8 overflow-hidden relative">
                            <div className="pointer-events-none absolute inset-x-[12%] top-[-3.5rem] h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.75),rgba(255,255,255,0))] opacity-70 blur-2xl dark:opacity-20"></div>
                            <p className="ios-kicker mb-4">
                                Rin Journal
                            </p>
                            <p className="ios-title">
                                {listState === 'draft' ? t('draft_bin') : listState === 'normal' ? t('article.title') : t('unlisted')}
                            </p>
                            <div className="flex flex-row flex-wrap justify-between items-center gap-3 mt-5">
                                <p className="text-sm t-secondary font-normal">
                                    {t('article.total$count', { count: feeds[listState]?.size })}
                                </p>
                                {profile?.permission &&
                                    <div className="flex flex-row flex-wrap gap-3">
                                        <Link href={listState === 'draft' ? '/?type=normal' : '/?type=draft'} className={`ios-pill text-sm font-normal ${listState === 'draft' ? "bg-theme text-white" : ""}`}>
                                            {t('draft_bin')}
                                        </Link>
                                        <Link href={listState === 'unlisted' ? '/?type=normal' : '/?type=unlisted'} className={`ios-pill text-sm font-normal ${listState === 'unlisted' ? "bg-theme text-white" : ""}`}>
                                            {t('unlisted')}
                                        </Link>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <Waiting for={status === 'idle'}>
                        <div className="wauto flex flex-col ani-show liquid-stack">
                            {feeds[listState].data.map(({ id, ...feed }: any) => (
                                <FeedCard key={id} id={id} {...feed} />
                            ))}
                        </div>
                        <div className="wauto flex flex-row items-center mt-4 ani-show">
                            {page > 1 &&
                                <Link href={`/?type=${listState}&page=${(page - 1)}`}
                                    className={`text-sm font-medium rounded-full px-5 py-2.5 text-white bg-theme shadow-[0_16px_36px_rgba(10,132,255,0.28)] bg-button`}>
                                    {t('previous')}
                                </Link>
                            }
                            <div className="flex-1" />
                            {feeds[listState]?.hasNext &&
                                <Link href={`/?type=${listState}&page=${(page + 1)}`}
                                    className={`text-sm font-medium rounded-full px-5 py-2.5 text-white bg-theme shadow-[0_16px_36px_rgba(10,132,255,0.28)] bg-button`}>
                                    {t('next')}
                                </Link>
                            }
                        </div>
                    </Waiting>
                </main>
            </Waiting>
        </>
    )
}
