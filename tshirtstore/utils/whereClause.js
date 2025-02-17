//base - Product.find()

//bigQ -//search=code&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199

class whereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }

    search() {
        const searchWord = this.bigQ.search ? {
            name: {
                $regex: search,
                $options: 'i'//i is for case sensitivity
            }
        } : {}
        this.base = this.base.find({ ...searchWord })
        console.log(this);
        return this;
    }
    filter() {
        const copyQ = { ...this.bigQ };

        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        //convert bigQ into a string => copyQ
        let stringOfCopyQ = JSON.stringify(copyQ);

        stringOfCopyQ = stringOfCopyQ.replace(
            /\b(gte|lte|gt|lt)\b/g,
            (m) => `$${m}`
        );

        const jsonOfCopyQ = JSON.parse(stringOfCopyQ);

        this.base = this.base.find(jsonOfCopyQ);
        return this;
    }

    pager(resultPerPage) {
        let currentPage = 1;
        if (this.bigQ.page) {
            currentPage = this.bigQ.page
        }
        const skipVal = resultPerPage * (currentPage - 1);
        this.base = this.base.limit(resultPerPage).skip(skipVal);
        return this;
    }
}

module.exports = whereClause;