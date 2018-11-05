export const default_nodes = [
  {
    name: 'root1',
    children: [
      {name: 'child1'},
      {name: 'child2'}
    ]
  },
  {
    name: 'root2',
    children: [
      {name: 'child2.1', children: []},
      {
        name: 'child2.2', children: [
          {}
        ]
      }
    ]
  },
  {
    name: 'root3',
    // hasChildren : true   // loading  node 가 보임
    // isExpanded:false     //  이미 확장 된 상태로 보여짐

  },
  {
    name: 'root4',
    children: [
      {
        name: 'child2.1',
        children: []
      }
    ]


  },
  {name: 'root5', children: null}
];
