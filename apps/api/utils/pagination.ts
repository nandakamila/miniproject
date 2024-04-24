export default function pagination(page: number = 1, pageSize: number = 10): { skip: number; take: number } {
    let skip: number = 0;
    let take: number = 12

    if (page < 1) {
        page = 1;
    }
    if (pageSize < 1) {
        pageSize = 12;
    }

    skip = (page - 1) * pageSize;
    take = pageSize;

    return { skip, take };
}

