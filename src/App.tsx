import {
  Text,
  useIndexResourceState,
  IndexTable,
  Card,
} from "@shopify/polaris";
import { faker } from "@faker-js/faker";
import type { IndexTableRowProps, IndexTableProps } from "@shopify/polaris";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { getSubHeaderColSpan } from "./helper";

import styles from "./App.module.css";

interface CustomerRow {
  position: number;
  id: string;
  url: string;
  name: string;
  location: string;
  orders: number;
  amountSpent: string;
  lastOrderDate: string;
}

interface CustomerGroup {
  id: string;
  position: number;
  customers: CustomerRow[];
}

interface Groups {
  [key: string]: CustomerGroup;
}

export default function App() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [subheaderColSpan, setSubheaderColSpan] = useState<number>();
  const rows = [
    {
      id: "3411",
      name: "Mae Jemison",
      lastOrderDate: "May 31, 2023",
    },
    {
      id: "2562",
      name: "Ellen Ochoa",
      lastOrderDate: "May 31, 2023",
    },
    {
      id: "4102",
      name: "Colm Dillane",
      lastOrderDate: "May 31, 2023",
    },
    {
      id: "2564",
      name: "Al Chemist",
      lastOrderDate: "April 4, 2023",
    },
    {
      id: "2563",
      name: "Larry June",
      lastOrderDate: "March 19, 2023",
    },
  ];

  const columnHeadings = [
    { title: "Name", id: "name" },
    { title: "Location", id: "location" },
    {
      id: "order-count",
      title: "Order count",
    },
    {
      hidden: false,
      id: "amount-spent",
      title: "Amount spent",
    },
  ];

  const groupRowsByLastOrderDate = () => {
    let position = 0;
    const groups: Groups = (rows as CustomerRow[]).reduce(
      (groups: Groups, customer: CustomerRow) => {
        const { lastOrderDate } = customer;
        if (!groups[lastOrderDate]) {
          groups[lastOrderDate] = {
            position,
            customers: [],
            id: `order-${lastOrderDate.split(" ").join("-")}`,
          };
        }

        groups[lastOrderDate].customers.push({
          ...customer,
          position,
        });

        position += 1;
        return groups;
      },
      {}
    );

    return groups;
  };

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(rows);

  const orders = groupRowsByLastOrderDate();

  useLayoutEffect(() => {
    const tableContainer = tableContainerRef.current;

    const resizeObserver = new ResizeObserver(() => {
      if (tableContainer) {
        setSubheaderColSpan(getSubHeaderColSpan(tableContainer));
      }
    });

    if (tableContainer) {
      setSubheaderColSpan(getSubHeaderColSpan(tableContainer));
      resizeObserver.observe(tableContainer);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const rowMarkup = Object.keys(orders).map((orderDate) => {
    const { customers, position, id: subheaderId } = orders[orderDate];
    let selected: IndexTableRowProps["selected"] = false;

    const someCustomersSelected = customers.some(({ id }) =>
      selectedResources.includes(id)
    );

    const allCustomersSelected = customers.every(({ id }) =>
      selectedResources.includes(id)
    );

    if (allCustomersSelected) {
      selected = true;
    } else if (someCustomersSelected) {
      selected = "indeterminate";
    }

    const childRowRange: IndexTableRowProps["selectionRange"] = [
      rows.findIndex((row) => row.id === customers[0].id),
      rows.findIndex((row) => row.id === customers[customers.length - 1].id),
    ];

    return (
      <Fragment key={subheaderId}>
        <IndexTable.Row
          rowType="subheader"
          selectionRange={childRowRange}
          id={subheaderId}
          key={subheaderId}
          position={position}
          selected={selected}
        >
          <IndexTable.Cell
            colSpan={subheaderColSpan}
            scope="colgroup"
            as="th"
            className={styles.subHeader}
            id={subheaderId}
          >
            {faker.lorem.words(25)}
          </IndexTable.Cell>

          <IndexTable.Cell colSpan={20} />
        </IndexTable.Row>
        {customers.map(({ id, name, position }, rowIndex) => {
          return (
            <IndexTable.Row
              key={rowIndex}
              id={id}
              position={position}
              selected={selectedResources.includes(id)}
            >
              <IndexTable.Cell
                headers={`${columnHeadings[0].id} ${subheaderId}`}
              >
                <Text variant="bodyMd" fontWeight="semibold" as="span">
                  {name}
                </Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <div className={styles.cell}>{faker.lorem.words(25)}</div>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <div className={styles.cell}>
                  <Text as="span" numeric>
                    {faker.lorem.words(25)}
                  </Text>
                </div>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <div className={styles.cell}>
                  <Text as="span" numeric>
                    {faker.lorem.words(25)}
                  </Text>
                </div>
              </IndexTable.Cell>
            </IndexTable.Row>
          );
        })}
      </Fragment>
    );
  });

  return (
    <Card>
      <div ref={tableContainerRef}>
        <IndexTable
          onSelectionChange={handleSelectionChange}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          resourceName={resourceName}
          itemCount={rows.length}
          headings={columnHeadings as IndexTableProps["headings"]}
        >
          {rowMarkup}
        </IndexTable>
      </div>
    </Card>
  );
}
