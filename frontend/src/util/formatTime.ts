function pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
}

function formatTime(timeInSeconds: number): string {
    let hours   = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor(timeInSeconds - (hours * 3600) - (minutes * 60))

    if (hours > 0) {
        return `${pad(hours)}h ${pad(minutes)}m`
    }

    if (minutes > 0) {
        return `${pad(minutes)}m ${pad(seconds)}s`
    }

    return `${pad(seconds)}s`
}

export default formatTime