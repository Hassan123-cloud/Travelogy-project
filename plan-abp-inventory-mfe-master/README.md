# plat-lui-maps-mfe

### Local Development
```
npm install
npm run start:local
```
Viewing localhost:7777, the functioning map project will appear

### Internationalization and localization (i18n)
#### Overview and setting up
- Choose the i18n library of your choice (example: [reacti18next](https://github.com/i18next/react-i18next))
- Set up locales for different languages. Translation files are under public/locales
- Each json file is a namespace being loaded during the translation process
- **For any new namespace being added, you need to add the namespace to i18n.js under src/**
- 
#### Usage
- Construct the label mapping in App.tsx and pass down the mapping to your container
 
 Example of the object after being processed: 
```
    container: {
        key: 'Key Label',
    },
    namespace1: {
        key1: 'Label1',
        key2: { subKey2: 'Label2'},
    },
    namespace2: {
        key3: 'Label3',
        key4: 'Label4',
    },
    ...
}
```

- For each component under the container, pass down the titles/labels as props using a specific namespace
```
          <ContainerComponent
            {..._.get(displayLabels, 'container', {})}
          >
            <ChildComponent1 {..._.get(displayLabels, 'namespace1', {})} />
            <ChildComponent2 {..._.get(displayLabels, 'namespace2', {})} />
            <ChildComponent3 labels={_.get(displayLabels, 'namespace1.key2', {})} />
          </ContainerComponent>
```
