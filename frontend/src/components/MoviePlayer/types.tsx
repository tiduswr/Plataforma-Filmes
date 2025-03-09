type HlsOptions = {
    controls: string[]
    quality?: {
        default: number,
        options: number[]
        forced: boolean
        onChange: (e: number) => void
    }
}

type MoviePlayerProps = {
    video_id: string
}

export type { HlsOptions, MoviePlayerProps }

