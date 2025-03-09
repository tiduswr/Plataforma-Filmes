type HlsOptions = {
    controls: string[]
    quality?: {
        default: number,
        options: number[]
        forced: boolean
        onChange: (e: number) => void
    }
}

export type { HlsOptions }

