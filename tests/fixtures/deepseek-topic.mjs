function fixture() {
  return {title:'光合作用',summary:'理解光能、叶绿体和物质转化之间的联系。',targetId:'photo',
    nodes:[{id:'energy',label:'能量转化',desc:'能量可以从一种形式转化为另一种形式。',layer:0},{id:'chloroplast',label:'叶绿体',desc:'叶绿体是植物进行光合作用的主要场所。',layer:1},{id:'photo',label:'光合作用',desc:'光能参与将无机物合成为有机物的过程。',layer:2}],
    edges:[{from:'energy',to:'chloroplast'},{from:'chloroplast',to:'photo'}],
    quiz:[{id:'q1',stem:'叶绿体主要参与哪一种作用？',options:['光合作用','血液循环','神经传导'],answer:0,tests:['chloroplast'],explain:'叶绿体参与光合作用。'},{id:'q2',stem:'光合作用利用的能量主要来自哪里？',options:['声音','光','磁场'],answer:1,tests:['energy'],explain:'光能用于物质合成。'}],
    retest:[{id:'r1',stem:'植物细胞进行光合作用的主要结构是什么？',options:['叶绿体','细胞壁','液泡'],answer:0,tests:['chloroplast'],explain:'光合作用主要发生于叶绿体。'},{id:'r2',stem:'光合作用涉及何种能量转化？',options:['化学能转为声能','光能转为化学能','声能转为光能'],answer:1,tests:['energy'],explain:'光能转为有机物中的化学能。'}],
    path:['energy','chloroplast','photo'].map((id,i)=>({id:'step'+i,nodeId:id,title:'理解'+id,minutes:5,kind:i===2?'迁移练习':'概念讲解',intro:'阅读定义、例子并进行自查。',sections:[{heading:'讲解',body:'结合植物生长的例子理解该知识点，并说明它与光合作用的关系。'}]}))};
}

export {fixture};
