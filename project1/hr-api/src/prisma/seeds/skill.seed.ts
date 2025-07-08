import { PrismaClient } from '@prisma/client'

const skillSeed = [
   {
      name: 'Python',
      description:
         "Python is a high-level, interpreted language known for its simplicity and readability. It is widely used in web development, data analysis, artificial intelligence, scientific computing, and automation. Python's extensive libraries, such as NumPy and Pandas, make it a popular choice for data-driven applications."
   },
   {
      name: 'Java',
      description:
         'Java is an object-oriented, platform-independent programming language. It follows the principle of "Write Once, Run Anywhere" (WORA), which means code written in Java can run on any device that supports the Java Virtual Machine (JVM). It is commonly used for building web applications, mobile apps (Android), and enterprise-level applications.'
   },
   {
      name: 'JavaScript',
      description:
         'JavaScript is a high-level, interpreted scripting language used primarily for creating interactive effects within web browsers. It is integral to web development (alongside HTML and CSS) for front-end development, but also used on the back-end through environments like Node.js. JavaScript is essential for building dynamic, responsive websites and web apps.'
   },
   {
      name: 'C++',
      description:
         'C++ is an extension of the C programming language that adds object-oriented features. It is a high-performance language, widely used in software development where performance and memory management are critical, such as video games, real-time simulations, operating systems, and embedded systems.'
   },
   {
      name: 'C# (C-Sharp)',
      description:
         'C# is a modern, object-oriented programming language developed by Microsoft. It is primarily used in the .NET framework for building web, desktop, and mobile applications. C# is commonly used in game development with Unity and is also widely used in enterprise applications.'
   },
   {
      name: 'Ruby',
      description:
         'Ruby is a dynamic, object-oriented scripting language known for its simplicity and developer productivity. It is most commonly associated with the Ruby on Rails web application framework, making it a popular choice for building web apps and rapid prototyping.'
   },
   {
      name: 'PHP',
      description:
         'PHP is a server-side scripting language primarily used for web development. It is widely embedded in HTML and used to create dynamic web pages. PHP powers many websites and content management systems like WordPress and is commonly used in building web applications and websites.'
   },
   {
      name: 'Swift',
      description:
         "Swift is a powerful, open-source programming language developed by Apple for building iOS, macOS, watchOS, and tvOS applications. It is known for its speed, safety, and modern syntax, making it easier to develop mobile apps for Apple's ecosystem."
   },
   {
      name: 'Go (Golang)',
      description:
         "Go is a statically typed, compiled language developed by Google. Known for its simplicity, speed, and scalability, Go is often used in systems programming, cloud computing, and developing scalable network servers. It's well-suited for backend development and microservices."
   },
   {
      name: 'TypeScript',
      description:
         'TypeScript is a superset of JavaScript that adds static typing. It allows for better error detection during development and enables larger-scale applications to be more maintainable. It compiles down to plain JavaScript, making it compatible with existing JavaScript codebases.'
   },
   {
      name: 'R',
      description:
         'R is a language and environment for statistical computing and graphics. It is widely used among statisticians and data scientists for data analysis, statistical modeling, and visualization. R has an extensive ecosystem of libraries for data manipulation, machine learning, and statistical analysis.'
   },
   {
      name: 'Kotlin',
      description:
         'Kotlin is a modern, statically-typed programming language developed by JetBrains. It is fully interoperable with Java and is officially supported for Android development. Kotlin is concise, expressive, and designed to improve upon Java, offering features like null safety and higher-order functions.'
   },
   {
      name: 'SQL (Structured Query Language)',
      description:
         'SQL is a domain-specific language used for managing and querying relational databases. It allows for operations like inserting, updating, and deleting data in a database, as well as retrieving information using SELECT statements. SQL is essential for working with relational database management systems (RDBMS) like MySQL, PostgreSQL, and SQL Server.'
   },
   {
      name: 'Shell Scripting (Bash, PowerShell)',
      description:
         'Shell scripting involves writing scripts for automating tasks within operating systems. Bash (Bourne Again Shell) is commonly used in Linux and macOS environments, while PowerShell is used in Windows environments. Shell scripts can be used for system administration, automation, and managing workflows.'
   },
   {
      name: 'Scala',
      description:
         'Scala is a high-level programming language that integrates functional and object-oriented programming paradigms. It is widely used for big data processing with frameworks like Apache Spark and is known for its conciseness and scalability.'
   },
   {
      name: 'Perl',
      description:
         'Perl is a high-level, interpreted language known for its text-processing capabilities and regular expressions. It is often used for tasks involving data manipulation, network programming, and web development, though it has been somewhat overtaken by languages like Python and Ruby.'
   },
   {
      name: 'Rust',
      description:
         'Rust is a systems programming language designed to be fast, safe, and concurrent. It focuses on memory safety without needing a garbage collector, making it ideal for low-level programming tasks, such as operating systems, game engines, and web browsers.'
   },
   {
      name: 'Lua',
      description:
         'Lua is a lightweight, high-level scripting language designed for embedded use in applications. It is often used for game development (e.g., scripting game logic) and is known for its simplicity and ease of integration with other languages.'
   },
   {
      name: 'MATLAB',
      description:
         'MATLAB is a proprietary programming language designed for numerical computing. It is primarily used for algorithm development, data analysis, and creating mathematical models. MATLAB is widely used in engineering, scientific research, and finance.'
   },
   {
      name: 'Haskell',
      description:
         'Haskell is a purely functional programming language known for its strong static typing, lazy evaluation, and immutability. It is often used in academic and research settings and is valued for building high-assurance software that needs to be highly reliable.'
   },
   {
      name: 'Objective-C',
      description:
         'Objective-C is a general-purpose, object-oriented language that was the primary language for iOS and macOS applications before Swift was introduced. It is still widely used in legacy Apple software and frameworks.'
   },
   {
      name: 'VHDL (VHSIC Hardware Description Language)',
      description:
         'VHDL is a hardware description language used to model and simulate electronic systems. It is often used for designing integrated circuits (ICs) and field-programmable gate arrays (FPGAs).'
   },
   {
      name: 'ActionScript',
      description:
         'ActionScript is a programming language used for building interactive websites and applications, particularly within Adobe Flash. While Flash is now largely deprecated, ActionScript was once essential for web animations and games.'
   },
   {
      name: 'Dart',
      description:
         'Dart is an object-oriented, class-based programming language developed by Google. It is primarily used for building mobile, desktop, and web applications, especially with the Flutter framework for cross-platform mobile development.'
   }
]

const prisma = new PrismaClient()

export const seedSkill = async () => {
   await Promise.all(
      skillSeed.map((skill) => {
         return prisma.skill.upsert({
            where: {
               name: skill.name
            },
            create: {
               name: skill.name,
               description: skill.description
            },
            update: {
               description: skill.description
            }
         })
      })
   )
}
