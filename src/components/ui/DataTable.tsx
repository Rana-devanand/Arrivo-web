type DataTableProps = {
  caption: string;
  headers: readonly string[];
  rows: readonly { cells: readonly string[] }[];
};

export function DataTable({ caption, headers, rows }: DataTableProps) {
  return (
    <table className="w-full border-separate border-spacing-y-3 text-left md:border-spacing-y-0">
      <caption className="sr-only">{caption}</caption>
      <thead className="hidden md:table-header-group">
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col" className="border-b border-border px-4 py-3 text-sm font-semibold text-muted-foreground">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.cells[0]} className="block rounded-lg border border-border bg-card md:table-row md:rounded-none md:border-0 md:bg-transparent">
            {row.cells.map((cell, index) => (
              <td
                key={index}
                data-label={headers[index]}
                className="block px-4 py-2 before:mb-1 before:block before:text-xs before:font-semibold before:uppercase before:text-muted-foreground before:content-[attr(data-label)] md:table-cell md:border-b md:border-border md:py-4 md:align-top md:before:hidden"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
