export const shipmentRegistration = {
  namespace: 'lct',
  name: 'shipments',
  type: 'point',
  label: 'In Transit Shipments',
  customizations: {
    pushpin: {
      dataSource:
        'https://lctuiqa01-api.jdadelivers.com/api/v1/shipments/summaries',
      behavior: {
        hover: [
          {
            type: 'singleHoverInfobox',
            dataSource:
              'https://lctuiqa01-api.jdadelivers.com/api/v1/shipments/{objectId}?viewType=info',
            condition: 'point_count == 1',
          },
          {
            type: 'clusterHoverInfobox',
            condition: 'point_count > 1',
          },
        ],
        click: [
          {
            dataSource:
              'https://lctmapmockserverfunction.azurewebsites.net/lct/map/v1/pin/{objectId}?viewType=cluster',
            condition: 'point_count > 1 and point_count <= 20',
            type: 'ClusterDrawer',
          },
        ],
      },
    },
    legend: {
      dataSource:
        'https://lctuiqa01-api.jdadelivers.com/api/v1/processModel/shipment/legends',
    },
    filterPanel: {
      dataSource:
        'https://lctmapmockserverfunction.azurewebsites.net/lct/map/v1/filterPanel?namespace=lct&name=shipments',
    },
  },
};

export const sitesRegistration = {
  namespace: 'lct',
  name: 'sites',
  type: 'point',
  customizations: {
    pushpin: {
      dataSource: 'https://api-dev.jdadelivers.com/lui/map/v1/points',
      behavior: {},
    },
  },
};

const warehouseRegistration = {
  namespace: 'lct',
  name: 'warehouses',
  type: 'point',
  customizations: {
    pushpin: {
      dataSource: 'https://api-dev.jdadelivers.com/lui/map/v1/points',
      behavior: {
        hover: [
          {
            dataSource:
              '/api/v1/warehouses/{pushpin_id}',
            styleCustomizations: {
              type: 'shipment-dropdown',
            },
          }
        ],
        click: [
          {
            dataSource:
              '/api/v1/randomAPI/{objectId}',
            styleCustomizations: {
              type: 'shipment-panel',
            },
          }
        ],
      },
    },
  },
};

export const registry = {
  data: [shipmentRegistration, sitesRegistration, warehouseRegistration],
};

export default registry;
