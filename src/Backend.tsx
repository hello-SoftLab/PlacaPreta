
import * as SQLite from 'expo-sqlite';
import { Database } from 'expo-sqlite';
import { createContext, useContext } from 'react';
import { stat } from 'react-native-fs';



//inicializando a database dos carros da garagem
export const InitDBContext = () => {

    const db = SQLite.openDatabase('database.db');

    

    const statements = [
      `CREATE TABLE IF NOT EXISTS cars (
            id int,
            alias text,
            aquisition_month,
            aquisition_year,
            license_plate text,
            name text,
            color text,
            year int,
            doors int,
            model text,
            years_of_production text,
            image_url text,
            transmission text,
            seats int,
            wheel text,
            motor text,
            max_speed text,
            acceleration text,
            fuel text,
            torque text,
            base_power text,
            max_power text
        )`
    ]

    

    console.log("initializing db!");

    db.transaction(tx => {
        for(const statement of statements){
            tx.executeSql(statement,[],(tx,result) => {
                console.log(`executed ${statement} with positive result!`);
            },(tx,error) => {
                console.log(`error at statement ${statement} with error message: ${error.message}`)
                return false;
            });
        }
    });



    return db;

}

export const DBFunctions = {
    insertNewCar: (presetName: string,carsDB: Database,db: Database,cb) => {
        const id = Math.floor(Math.random()*1000000);
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM history_of_cars WHERE name=?",[presetName],(tx,result) => {
                carsDB.transaction(txTwo => {
                    const item = result.rows.item(0);
                    txTwo.executeSql(`INSERT INTO cars (id,name,year,doors,model,years_of_production,image_url,transmission,seats,wheel,motor,max_speed,acceleration,fuel,torque,base_power,max_power) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
                    ,[
                        id,
                        item['name'],
                        item['year'],
                        item['doors'],
                        item['model'],
                        item['years_of_production'],
                        item['image_url'],
                        item['transmission'],
                        item['seats'],
                        item['wheel'],
                        item['motor'],
                        item['max_speed'],
                        item['acceleration'],
                        item['fuel'],
                        item['torque'],
                        item['base_power'],
                        item['max_power']
                    ],(txTwo,result) => {
                        cb();
                    },(txTwo,err) => {
                        console.log(`ERROR IN INSERTING TO CARS => ${err.message}`)
                        return false;
                    });
                })
            });
            
        })
        return id;
    },
    removeCar: (idToRemove:number,carsDB:Database) => {
        carsDB.transaction(tx => {
            tx.executeSql("DELETE FROM cars WHERE id=?",[idToRemove],(tx,result) => {
                console.log(`Removed car with id = ${idToRemove}!`)
                
            },(tx,err) => {
                console.log(`Error ${err.message} when attempting to remove car with id = ${idToRemove}`)
                return false;
            })
        });
    },
    updateCar: (carsDB: Database,query:string,values?) => {
        carsDB.transaction(tx => {
            tx.executeSql(query,values,(tx,result) => {
                console.log(`Succesfully updated values with query => ${query}`)
                tx.executeSql(`SELECT * FROM cars`,[],(tx,result) => {
                    console.log(`DATA IN DB => ${JSON.stringify(result.rows._array)}`)
                })
            },(tx,err) => {
                console.log(`Error ${err.message} when attempting to update cars db with query => ${query}`)
                return false;
            });
        })
    },
    executeStatement: (db:Database,statement:string,values) => {
        db.transaction(tx => {
            tx.executeSql(statement,values,(tx,result) => {
                console.log(`Executed statment => ${statement}, values => ${JSON.stringify(values)}, result => ${JSON.stringify(result)}`)
            },(tx,err) => {
                console.log(`Error in statement => ${statement} => ${err.message}`);
                return false;
            })
        })
    }
}

export const InitAllCarsDB = () => {
    const db = SQLite.openDatabase('cars_data.db',undefined,undefined,undefined);

    console.log("initializing cars_data db!");

    console.log(`db version = ${db.version}`)

    db.transaction(tx => {
        tx.executeSql(`SELECT COUNT(*) FROM history_of_cars`,[],(tx,result)=>{
            console.log(`data count => ${JSON.stringify(result.rows._array)}`)
        })
    })

    
    return db;
}



export const DBContext = createContext({garageDB: null as SQLite.Database,allCarsDB: null as SQLite.Database });

