import {
  Text,
  useIndexResourceState,
  IndexTable,
  useBreakpoints,
  Card,
} from "@shopify/polaris";
import type { IndexTableRowProps, IndexTableProps } from "@shopify/polaris";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { getSubHeaderColSpan } from "./helper";

import styles from "./App.module.css";

interface Customer {
  id: string;
  url: string;
  name: string;
  location: string;
  orders: number;
  amountSpent: string;
  lastOrderDate: string;
}

interface CustomerRow extends Customer {
  position: number;
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
      url: "#",
      name: "Mae Jemison",
      location: "Decatur, USA",
      orders: 11,
      amountSpent: "$2,400",
      lastOrderDate: "May 31, 2023",
    },
    {
      id: "2562",
      url: "#",
      name: "Ellen Ochoa",
      location: "Los Angeles, USA",
      orders: 30,
      amountSpent: "$975",
      lastOrderDate: "May 31, 2023",
    },
    {
      id: "4102",
      url: "#",
      name: "Colm Dillane",
      location: "New York, USA",
      orders: 27,
      amountSpent: "$2885",
      lastOrderDate: "May 31, 2023",
    },
    {
      id: "2564",
      url: "#",
      name: "Al Chemist",
      location: "New York, USA",
      orders: 19,
      amountSpent: "$1,209",
      lastOrderDate: "April 4, 2023",
    },
    {
      id: "2563",
      url: "#",
      name: "Larry June",
      location: "San Francisco, USA",
      orders: 22,
      amountSpent: "$1,400",
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
    const groups: Groups = (rows as Customer[]).reduce(
      (groups: Groups, customer: Customer) => {
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
      // resizeObserver.observe(tableContainer);
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
            {subheaderColSpan &&
              `Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus nihil tempore voluptas nobis, aperiam in. Voluptate
            perspiciatis explicabo consequuntur modi odio labore, ad doloremque
            ab magnam numquam, animi odit officiis?`}
          </IndexTable.Cell>

          <IndexTable.Cell colSpan={Number.MAX_SAFE_INTEGER} />
        </IndexTable.Row>
        {customers.map(
          ({ id, name, location, orders, amountSpent, position }, rowIndex) => {
            return (
              <IndexTable.Row
                key={rowIndex}
                id={id}
                position={position}
                selected={selectedResources.includes(id)}
              >
                <IndexTable.Cell
                  flush
                  headers={`${columnHeadings[0].id} ${subheaderId}`}
                >
                  <Text variant="bodyMd" fontWeight="semibold" as="span">
                    {name}
                  </Text>
                </IndexTable.Cell>

                <IndexTable.Cell flush>
                  <div className={styles.cell}>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Rerum quos iste ipsam, est incidunt aliquid, voluptatum sed
                    delectus reiciendis itaque corrupti sequi magnam ab minus
                    perferendis libero in quam nostrum. {location}
                  </div>
                </IndexTable.Cell>
                <IndexTable.Cell flush>
                  <div className={styles.cell}>
                    <Text as="span" numeric>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Rerum quos iste ipsam, est incidunt aliquid, voluptatum
                      sed delectus reiciendis itaque corrupti sequi magnam ab
                      minus perferendis libero in quam nostrum. {orders}
                    </Text>
                  </div>
                </IndexTable.Cell>
                <IndexTable.Cell flush>
                  <div className={styles.cell}>
                    <Text as="span" numeric>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Rerum quos iste ipsam, est incidunt aliquid, voluptatum
                      sed delectus reiciendis itaque corrupti sequi magnam ab
                      minus perferendis libero in quam nostrum. {amountSpent}
                    </Text>
                  </div>
                </IndexTable.Cell>
              </IndexTable.Row>
            );
          }
        )}
      </Fragment>
    );
  });

  return (
    <Card>
      <div ref={tableContainerRef}>
        <IndexTable
          condensed={useBreakpoints().smDown}
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
