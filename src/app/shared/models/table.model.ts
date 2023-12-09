export class Table {
  public rows = 20;
  public columns = 10;
  public table = new Array(this.rows).fill(new Array(this.columns).fill(0));
}
