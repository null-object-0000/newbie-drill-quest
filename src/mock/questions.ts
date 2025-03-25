export interface Question {
  id: string
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  answer: string
}

export interface QuestionBank {
  id: string
  name: string
  description: string
  questions: Question[]
}

export const questionBanks: QuestionBank[] = [
  {
    id: 'java-basic',
    name: 'Java 基础',
    description: 'Java 语言基础知识面试题',
    questions: [
      {
        id: 'jb-1',
        content: '请解释 Java 中的面向对象编程特性',
        difficulty: 'easy',
        category: 'java-basic',
        answer: 'Java的面向对象特性主要包括：\n1. 封装：通过访问修饰符控制类的属性和方法的访问权限\n2. 继承：子类可以继承父类的特性，实现代码重用\n3. 多态：同一个方法可以根据不同对象产生不同的行为\n4. 抽象：抽象类和接口用于定义类的模板'
      },
      {
        id: 'jb-2',
        content: '什么是 Java 中的异常处理机制？',
        difficulty: 'medium',
        category: 'java-basic',
        answer: 'Java异常处理机制包括：\n1. try-catch-finally 结构\n2. throws 声明异常\n3. throw 抛出异常\n4. 异常分为检查型异常和非检查型异常\n5. 自定义异常类的创建方式'
      }
    ]
  },
  { "id": "java-jvm", "name": "Java 虚拟机", "description": "JVM 原理及调优相关面试题", "questions": [{ "id": "java-jvm-0", "content": "什么是 JVM？它的核心作用是什么？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-1", "content": "JVM 的内存区域是如何划分的？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-2", "content": "什么是内存溢出（OOM）？常见的 OOM 场景有哪些？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-3", "content": "堆（Heap）和方法区（Method Area）的区别是什么？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-4", "content": "什么是直接内存（Direct Memory）？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-5", "content": "堆内存中有哪些可调整的参数？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-6", "content": "直接内存和堆内存有什么不同？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-7", "content": "如何使用直接内存？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-8", "content": "Java 中类加载过程是怎样的？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-9", "content": "双亲委派模型是什么？为何需要？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-10", "content": "有哪些类加载器？他们分别加载什么类？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-11", "content": "什么时候会触发类的加载？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-12", "content": "如何破坏双亲委派机制？为何要破坏？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-13", "content": "Tomcat 是如何打破双清委派的？为何要破坏？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-14", "content": "如何自定义一个类加载器？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-15", "content": "堆内存分代机制是怎样的？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-16", "content": "Java 中的对象创建过程是怎样的？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-17", "content": "对象的访问定位方式有哪些？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-18", "content": "堆内存分代机制是怎样的？为什么要这么分？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-19", "content": "Java 8 做了什么调整？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-20", "content": "对象在内存中是如何储存的？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-21", "content": "对象头信息里有什么？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-22", "content": "什么时候对象会进入老年代？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-23", "content": "栈和堆的区别？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-24", "content": "为什么要有两个 Survivor 区？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-25", "content": "如何调整分区大小？默认比例？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-26", "content": "方法区（永久代/元空间）会发生垃圾回收吗？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-27", "content": "垃圾回收有哪些算法？各有什么特点？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-28", "content": "哪些对象可以被作为 GC Roots？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-29", "content": "强引用、软引用、弱引用、虚引用的区别和应用场景是什么？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-30", "content": "如何判断一个对象是否“存活”？", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-31", "content": "如何判断一个常量是废弃常量?", "answer": "", "difficulty": "medium", "category": "java-jvm" }, { "id": "java-jvm-32", "content": "如何判断一个类是无用类？", "answer": "", "difficulty": "medium", "category": "java-jvm" }] },
  {
    id: 'redis',
    name: 'Redis',
    description: 'Redis 缓存数据库相关面试题',
    questions: [
      {
        id: 'redis-1',
        content: '请介绍 Redis 的数据类型及其使用场景',
        difficulty: 'medium',
        category: 'redis',
        answer: 'Redis主要数据类型：\n1. String：缓存、计数器、分布式锁等\n2. Hash：存储对象，如用户信息\n3. List：消息队列、最新N个数据等\n4. Set：去重、随机获取元素等\n5. Sorted Set：排行榜、优先级队列等'
      },
      {
        id: 'redis-2',
        content: 'Redis 的持久化机制有哪些？',
        difficulty: 'medium',
        category: 'redis',
        answer: 'Redis持久化机制：\n1. RDB：按指定时间间隔生成数据快照\n2. AOF：记录每次写操作命令\n3. 混合持久化：结合RDB和AOF的优点\n4. 持久化策略的选择考虑因素'
      }
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'MySQL 数据库相关面试题',
    questions: [
      {
        id: 'mysql-1',
        content: '请解释 MySQL 的事务特性',
        difficulty: 'medium',
        category: 'mysql',
        answer: 'MySQL事务特性（ACID）：\n1. 原子性：事务是最小执行单位，要么全执行，要么全不执行\n2. 一致性：事务执行前后数据库保持一致状态\n3. 隔离性：事务执行不受其他事务影响\n4. 持久性：事务一旦提交，其修改是永久的'
      },
      {
        id: 'mysql-2',
        content: 'MySQL 的索引原理是什么？',
        difficulty: 'hard',
        category: 'mysql',
        answer: 'MySQL索引原理：\n1. B+树结构特点和优势\n2. 聚集索引与非聚集索引的区别\n3. 索引的创建原则\n4. 索引的优化策略\n5. 索引失效的常见情况'
      }
    ]
  }
]