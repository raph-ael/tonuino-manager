const database = {

    getAll: () => {

        return [
            {
                id: 1,
                name: 'Rolf Zukowski - Vogelhochzeit',
                folder: '02',
                title: [
                    {
                        id: 1,
                        name: '01 - Vogelhochzeit',
                        file: '001.mp3'
                    },
                    {
                        id: 2,
                        name: '02 - Erzähler',
                        file: '002.mp3'
                    }
                ]
            },
            {
                id: 2,
                name: 'Die kunterbunte kugelrunde gute Träume Frau',
                folder: '03',
                title: [
                    {
                        id: 1,
                        name: '01 - Vogelhochzeit',
                        file: '001.mp3'
                    },
                    {
                        id: 2,
                        name: '02 - Erzähler',
                        file: '002.mp3'
                    }
                ]
            }
        ];

    }

};

export default database;