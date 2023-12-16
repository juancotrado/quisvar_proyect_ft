import './costTable.css';
interface CostTableProps {
  mount: number;
}
const CostTable = ({ mount = 0 }: CostTableProps) => {
  const partialByMounth = +(mount / 30).toFixed(2);
  const stayByMounth = +(1000 / 30).toFixed(2);
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={3} scope="rowgroup">
            Cuadro de costos
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Parcial/ por mes</th>
          <td>S/ {mount}</td>
          <td>S/ {partialByMounth.toFixed(2)}</td>
        </tr>
        <tr>
          <th>Estadia/ por mes</th>
          <td>S/ 1000</td>
          <td>S/ {stayByMounth}</td>
        </tr>
        <tr>
          <th>Sueldo Bruto</th>
          <td>S/ {mount + 1000}</td>
          <td>S/ {partialByMounth + stayByMounth}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CostTable;
