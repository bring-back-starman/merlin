const _ = require('lodash');

class Table {
  constructor($, $table) {
    this.headers = [];
    $table.find('thead th').each((_, th) =>
      this.headers.push($(th).text())
    );

    this.data = $table.find('tbody tr').map((_, row) =>
      [$(row).find('td').map((_, td) =>
        $(td)
      ).get()]
    ).get();

    this.mappers = {};
  }

  setHeaders(headers) {
    this.headers = headers;
  }

  addMapper(header, mapper) {
    if (!this.headers.includes(header)) {
      throw new Error('Unknown header ' + header);
    }

    this.mappers[header] = mapper;
  }

  addTextMapper(header, mapper) {
    this.addMapper(header, (value) => mapper(value.text()));
  }

  addNullMapper(header, nullValue) {
    this.addTextMapper(header, (value) => value === nullValue ? null : value);
  }

  toObjects() {
    const data = this.data.filter(row => row.length === this.headers.length);

    return data.map((values) => {
      let object = _.zipObject(this.headers, values);

      object = _.mapValues(object, (value, key) => {
        return _.has(this.mappers, key)
          ? this.mappers[key](value)
          : value.text();
      });

      return object;
    });
  }
}

module.exports = Table;