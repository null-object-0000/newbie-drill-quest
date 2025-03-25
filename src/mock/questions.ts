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
  {
    id: 'java-jvm',
    name: 'Java 虚拟机',
    description: 'JVM 原理及调优相关面试题',
    questions: [
      {
        id: 'jvm-1',
        content: '请描述 JVM 的内存结构',
        difficulty: 'hard',
        category: 'java-jvm',
        answer: 'JVM内存结构包括：\n1. 堆区：存储对象实例\n2. 方法区：存储类信息、常量、静态变量\n3. 虚拟机栈：存储局部变量表、操作数栈等\n4. 本地方法栈：执行Native方法\n5. 程序计数器：记录当前线程执行位置'
      },
      {
        id: 'jvm-2',
        content: '什么是 JVM 垃圾回收机制？',
        difficulty: 'medium',
        category: 'java-jvm',
        answer: 'JVM垃圾回收机制：\n1. 判断对象是否存活（引用计数/可达性分析）\n2. 垃圾收集算法（标记-清除、复制、标记-整理）\n3. 垃圾收集器（Serial、Parallel、CMS、G1等）\n4. 内存分代（新生代、老年代）'
      }
    ]
  },
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