# photo-tagging-API
 #### Backend
    ##### Post/registerRound
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
-schema:
```prisma
model Map{
  id        Int @id @default(autoincrement())
  name      String?
  pxWidth   Int
  pxHeight  Int
  path      String
  targets   Target[]
  players   Player[]

}
model Target{
  targetId  String @id @unique
  Xpos      Int
  ypos      Int
  map       Map @relation(fields: [mapId], references: [id])
  mapId     Int
}
model Player{
  id        Int @id @default(autoincrement())
  name      String @default("annonymous")
  map       Map @relation(fields: [mapId], references: [id])
  mapId     Int
  timeSec   Int
}    
```
general dependencies:

@prisma/adapter-pg
@prisma/client    
cors
dotenv
express
express-validator
pg