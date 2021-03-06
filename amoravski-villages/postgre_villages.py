import re
import psycopg2
import dump_data


def execute_query(query,result):
    ''' Connect to postgre and execute query
        Params:
        - str query
        - bool result - Query gets result if true
        Returns:
        - str result_str
    '''
    result_str =''
    #print(query)
    try:
        connection = psycopg2.connect(user = "amoravski",
                                     password = "strongpassword",
                                     host = "127.0.0.1",
                                     port = "5432",
                                     database = "villages")
        cursor = connection.cursor()
        cursor.execute(query)
        if result:
            result_str = cursor.fetchall()
        connection.commit()
        connection.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if connection is not None:
            connection.close()
        if result:
            return result_str
        return


def sanitize_string(string):
    return re.sub(r"[^a-zA-Z0-9а-яА-Я ]", "", string)


def master_insert():
    ''' Constructs all queries to run, done at the same time
        because of spreadsheet format
    '''
    vil_insert = "INSERT INTO villages(ekatte, name, obstina) VALUES"
    mun_insert = "INSERT INTO municipality(obstina, name, oblast) VALUES"
    reg_insert = "INSERT INTO region(oblast,name) VALUES"

    vil_data = dump_data.get_values_from_spreadsheet("Ek_atte.xlsx")
    # First row is irrelevant on Ek_atte
    del vil_data[0]
    mun_data = dump_data.get_values_from_spreadsheet("Ek_obst.xlsx")
    reg_data = dump_data.get_values_from_spreadsheet("Ek_obl.xlsx")

    mun_ekkates = [ x['ekatte'] for x in mun_data ]
    reg_ekkates = [ x['ekatte'] for x in reg_data ]

    for vil_row in vil_data:
        if vil_row['ekatte'] in mun_ekkates:
            muns = [ mun for mun in mun_data if vil_row['ekatte']==mun['ekatte']]
            for mun in muns:
                mun_insert += " (\'{}\',\'{}\',\'{}\'),".format(sanitize_string(mun["obstina"]),sanitize_string(mun["name"]),sanitize_string(vil_row["oblast"]))
        if vil_row['ekatte'] in reg_ekkates:
            regs = [ reg for reg in reg_data if vil_row['ekatte']==reg['ekatte']]
            for reg in regs:
                reg_insert += " (\'{}\',\'{}\'),".format(sanitize_string(reg["oblast"]),sanitize_string(reg["name"]))
        vil_insert += " (\'{}\',\'{}\',\'{}\'),".format(sanitize_string(vil_row["ekatte"]),sanitize_string(vil_row["name"]),sanitize_string(vil_row["obstina"]))

    vil_insert = vil_insert[:-1]
    vil_insert += " ON CONFLICT (ekatte) DO UPDATE SET name = excluded.name, obstina = excluded.obstina;"

    mun_insert = mun_insert[:-1]
    mun_insert += " ON CONFLICT (obstina) DO UPDATE SET name = excluded.name, oblast = excluded.oblast;"

    reg_insert = reg_insert[:-1]
    reg_insert += " ON CONFLICT (oblast) DO UPDATE SET name = excluded.name;"

    execute_query(reg_insert, False)
    execute_query(mun_insert, False)
    execute_query(vil_insert, False)


def get_statistics(tables):
    ''' Gets number of rows in supplied tables
        Params:
        - list tables
        Return:
        - list of tuples ( name, rows )
    '''
    for table in tables:
        yield (table, execute_query("SELECT COUNT(*) FROM {};".format(table), True)[0][0])

def get_villages(filter):
    ''' Gets villages, can be filtered
        Params:
        - str filter - case insensitive village name filter
        Return:
        - list of tuples (village name, municipality name, region name)
    '''
    result = execute_query("SELECT (villages.name, municipality.name, region.name) FROM villages INNER JOIN municipality ON(villages.obstina = municipality.obstina) INNER JOIN region ON (municipality.oblast = region.oblast) WHERE villages.name ILIKE \'{}%\';".format(sanitize_string(filter)), True)
    return [ x[0] for x in result ]

if __name__ == "__main__":
    # Demonstration if ran as main
    print("Filling up tables...")
    master_insert()
    print("Getting row number for tables...")
    for value in get_statistics(["villages","municipality","region"]):
        print(value)
    print(get_villages("бяла"))
