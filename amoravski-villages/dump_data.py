import xlrd

def get_values_from_spreadsheet(path):
    workbook = xlrd.open_workbook(path)
    worksheet = workbook.sheet_by_index(0)
    values = []
    for row_idx in range(1, worksheet.nrows):
        col_value = dict()
        for col_idx in range(0, worksheet.ncols):
            cell_val = worksheet.cell_value(row_idx, col_idx)
            col_value[worksheet.cell_value(0,col_idx)] = cell_val
        values.append(col_value)
    return values

def get_obl_from_obst(values):
    reg = get_values_from_spreadsheet("Ek_atte.xlsx")
    for row in values:
        print("we did it")
        row['oblast'] = [x['oblast'] for x in reg if x['ekatte']==row['ekatte']][0]
    return values;
