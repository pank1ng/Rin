import { useEffect, useRef, useState } from "react";
import { Helmet } from 'react-helmet';
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { HashTag } from "../components/hashtag";
import { Waiting } from "../components/loading";
import { client } from "../main";
import { siteName } from "../utils/constants";
import { usePageBodyClass } from "../hooks/usePageBodyClass";

type Hashtag = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    feeds: number;
}

export function HashtagsPage() {
    const { t } = useTranslation();
    usePageBodyClass("liquid-page");
    const [hashtags, setHashtags] = useState<Hashtag[]>();
    const ref = useRef(false);
    useEffect(() => {
        if (ref.current) return;
        client.tag.index.get().then(({ data }) => {
            if (data && typeof data !== 'string') {
                setHashtags(data);
            }
        });
        ref.current = true;
    }, [])
    return (
        <>
            <Helmet>
                <title>{`${t('hashtags')} - ${process.env.NAME}`}</title>
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={t('hashtags')} />
                <meta property="og:image" content={process.env.AVATAR} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={document.URL} />
            </Helmet>
            <Waiting for={hashtags}>
                <main className="w-full flex flex-col justify-center items-center mb-8 ani-show">
                    <div className="wauto text-start py-6">
                        <div className="glass-card liquid-surface px-6 py-7 md:px-8 md:py-8 overflow-hidden relative">
                            <div className="pointer-events-none absolute inset-x-[12%] top-[-3.5rem] h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.75),rgba(255,255,255,0))] opacity-70 blur-2xl dark:opacity-20"></div>
                            <p className="ios-kicker mb-4">
                                Explore
                            </p>
                            <p className="ios-title">
                                {t('hashtags')}
                            </p>
                        </div>
                    </div>

                    <div className="wauto flex flex-col flex-wrap items-start justify-start liquid-stack">
                        {hashtags?.filter(({ feeds }) => feeds > 0).map((hashtag, index) => {
                            return (
                                <div key={index} className="w-full flex flex-row">
                                    <div className="w-full glass-card liquid-surface rounded-[24px] m-2 px-5 py-4 duration-300 flex flex-row items-center space-x-4">
                                        <Link href={`/hashtag/${hashtag.name}`} className="text-base t-primary hover:text-theme text-pretty overflow-hidden">
                                            <HashTag name={hashtag.name} />
                                        </Link>
                                        <div className="flex-1" />
                                        <span className="t-secondary text-sm">
                                            {t("article.total_short$count", { count: hashtag.feeds })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </main>
            </Waiting>
        </>
    )
}
