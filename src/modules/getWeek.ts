export interface DateInfo{
    item: string,
    day: string,
    date: number,
    month: string,
    year: number
}

class GetWeek {
    startDate = new Date();
    readonly days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    setWeek(): DateInfo[] {
        const dateSet = [];
        for (let i = 0; i < 7; i += 1) {
            const day = new Date(this.startDate);
            dateSet.push(new Date(day.setDate(this.startDate.getDate() + i)));
        }
        const result: DateInfo[] = [];
        dateSet.map((item: Date) => result.push({
            day: this.days[item.getDay()],
            date: item.getDate(),
            month: this.months[item.getMonth()],
            year: item.getFullYear(),
            item: `${item.getFullYear()}-${item.getMonth() < 9 ? '0' + (item.getMonth() + 1): (item.getMonth() + 1)}-${item.getDate() < 9 ? '0' + item.getDate() : item.getDate()}`,
        }));
        return result;
    }
    getDayBefore(): DateInfo[] {
        this.startDate.setDate(this.startDate.getDate() - 1);
        return this.setWeek();
    }
    getDayAfter(): DateInfo[] {
        this.startDate.setDate(this.startDate.getDate() + 1);
        return this.setWeek();
    }
}

export const getWeek = new GetWeek();
