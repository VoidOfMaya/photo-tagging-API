import { body } from "express-validator";
// gamestart {playername: 'david', mapId: map.id}
const validateStart =body('name')
                    .isAlpha().withMessage('name must contain only letters')
                    .isLength({max: 10, min: 0}).withMessage('name must contain between 0 - 10 characters')
/*
gameend: {
    "playerId": 1,
    "mapId": 1,
    "screensize": {"W": 2560, "H": 1609
    },
    //targetId": "wanda", "x": 1806,"y": 84
    "targets": [
        {"targetId": "waldo", "x": 2214,"y": 649
        }...
    ]
}
*/
const roundData = []

export{
    roundData,
    validateStart
}