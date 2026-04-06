import { body } from "express-validator";
// gamestart {playername: 'david', mapId: map.id}
const validateStart =[
    body('playername')
    .trim()
    .isAlphanumeric().withMessage('Name can only contain letters, numbers, and spaces')
    .isLength({max: 10}).withMessage('name must contain between 0 - 10 characters'),
    
    body('mapId')
    .exists().withMessage('no map id was detected')
    .isInt().withMessage('map id must be an integer')
    .toInt()
    ]
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