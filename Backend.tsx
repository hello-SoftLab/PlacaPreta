
import * as SQLite from 'expo-sqlite';
import { createContext, useContext } from 'react';



//inicializando a database dos carros da garagem
export const InitDBContext = () => {

    const db = SQLite.openDatabase('database.db');

    

    const statements = [
        `DROP TABLE cars`,
        `CREATE TABLE IF NOT EXISTS cars (
            id int,
            name text
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

export const InitAllCarsDB = () => {
    const db = SQLite.openDatabase('cars_data.db');

    console.log("initializing cars_data db!");

    return db;
}



export const DBContext = createContext({garageDB: null as SQLite.Database,allCarsDB: null as SQLite.Database });

