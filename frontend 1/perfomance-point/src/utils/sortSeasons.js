function sortSeasons(seasonsArray) {
    const sortedArray = seasonsArray.sort((a, b) => {
        const seasonA = parseInt(a.split("/")[0]);
        const seasonB = parseInt(b.split("/")[0]);
        return seasonA - seasonB;
    });

    return sortedArray;

}

export default sortSeasons;