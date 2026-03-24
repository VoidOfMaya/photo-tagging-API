# photo-tagging-API
 #### Backend
    ##### /finish
    - validates and sanitizes front end input
    - checks if target data overlaps with target data from the db
        * queries database for, original imgSize and target position
        ```js
            //Prisma ORM
            return prisma.findUnique({
                where: {id: mapId},
                include:{
                    targets:{
                        where:{targetId: targetId}
                    }
                }
            })
            
        ```
    - normalizes and finds the scalling factor for both W & H
    - applies resize factor to target position
    -checks if selected target position  overlaps with database targets
        with ano verlap margin of 50px  (the size of search circle in the UI)
    - sends 200 ok response

### database 

map{
    id
    targets[targetId]
}
target{
    id
    name
    Xpos
    Ypos
}
score{
    name
    mapId
    time
}
dependencies:

@prisma/adapter-pg
@prisma/client    
cors
dotenv
express
express-validator
pg