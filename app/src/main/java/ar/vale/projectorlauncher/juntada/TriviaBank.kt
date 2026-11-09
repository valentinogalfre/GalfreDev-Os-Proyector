package ar.vale.projectorlauncher.juntada

import java.util.Random

/**
 * Preguntas propias, para cuando no hay clave de Claude o no hay red: la trivia arranca igual.
 * La primera opción de cada una es la correcta; se mezclan al armar la partida.
 */
object TriviaBank {

    private class Item(val text: String, val right: String, val a: String, val b: String, val c: String, val fact: String)

    private val ALL = listOf(
        Item("¿En qué año salió la primera versión de Python?", "1991", "1985", "1995", "2000", "Guido van Rossum publicó Python 0.9.0 en febrero de 1991."),
        Item("¿En cuántos días se escribió la primera versión de JavaScript?", "10", "30", "90", "365", "Brendan Eich la armó en diez días, en mayo de 1995."),
        Item("¿Quién creó el núcleo de Linux?", "Linus Torvalds", "Richard Stallman", "Dennis Ritchie", "Ken Thompson", "Lo anunció en 1991, como un pasatiempo."),
        Item("¿Qué puerto usa HTTPS si no se indica otro?", "443", "80", "8080", "22", "El 80 es de HTTP y el 22, de SSH."),
        Item("¿Cuánto da 0.1 + 0.2 en JavaScript?", "0.30000000000000004", "0.3", "0.30", "NaN", "Pasa en casi todos los lenguajes: es cómo se guardan los decimales en binario."),
        Item("¿Quién es considerada la primera programadora de la historia?", "Ada Lovelace", "Grace Hopper", "Margaret Hamilton", "Hedy Lamarr", "Escribió un algoritmo para la máquina analítica de Babbage, en 1843."),
        Item("¿Qué código de HTTP significa que la página no existe?", "404", "401", "500", "302", "El 401 es sin permiso y el 500, un error del servidor."),
        Item("¿Qué código de HTTP dice «soy una tetera»?", "418", "420", "451", "999", "Nació como una broma del 1 de abril de 1998 y quedó."),
        Item("¿Qué estructura de datos saca primero lo último que entró?", "Una pila", "Una cola", "Un árbol", "Un conjunto", "En inglés, LIFO: last in, first out."),
        Item("¿Qué empresa creó el lenguaje Kotlin?", "JetBrains", "Google", "Oracle", "Microsoft", "Lleva el nombre de una isla cerca de San Petersburgo."),
        Item("¿Qué empresa creó el lenguaje Go?", "Google", "Meta", "Apple", "Amazon", "Lo diseñaron Robert Griesemer, Rob Pike y Ken Thompson."),
        Item("¿Cuántos pasos hace, como mucho, una búsqueda binaria entre mil elementos ordenados?", "10", "100", "500", "1000", "Cada paso descarta la mitad: dos a la diez es 1024."),
        Item("¿Cuál de estos no es una base de datos?", "Nginx", "PostgreSQL", "Redis", "SQLite", "Nginx es un servidor web."),
        Item("¿Qué animal es la mascota de Linux?", "Un pingüino", "Un zorro", "Un elefante", "Una ballena", "Se llama Tux."),
        Item("¿Qué editor se cierra sin guardar con :q! ?", "Vim", "Emacs", "Nano", "VS Code", "Salir de Vim es una de las preguntas más vistas de Stack Overflow."),
        Item("¿Cuánto es 0xFF en decimal?", "255", "256", "128", "1024", "Es el valor más alto que entra en un byte."),
        Item("¿Qué hace git stash?", "Guarda los cambios sin terminar para después", "Borra la rama actual", "Sube los cambios al servidor", "Deshace el último commit", "Se recuperan con git stash pop."),
        Item("¿Cuál fue el primer navegador gráfico que se hizo popular?", "Mosaic", "Netscape", "Internet Explorer", "Opera", "Salió en 1993. Netscape llegó un año después."),
        Item("¿En qué año salió el primer iPhone?", "2007", "2005", "2009", "2010", "No tenía tienda de apps: llegó en 2008."),
        Item("¿Qué lenguaje usa archivos terminados en .rs?", "Rust", "Ruby", "R", "Reason", "Los de Ruby terminan en .rb."),
        Item("¿Cuántos bits tiene un byte?", "8", "4", "16", "10", "Cuatro bits son un nibble."),
        Item("¿Qué significa la S de SQL?", "Structured", "Simple", "Standard", "Server", "Structured Query Language."),
        Item("¿Cuántas provincias tiene la Argentina?", "23", "21", "22", "24", "Son 23, más la Ciudad Autónoma de Buenos Aires."),
        Item("¿Cuál es el planeta más grande del sistema solar?", "Júpiter", "Saturno", "Neptuno", "La Tierra", "Adentro entrarían más de mil Tierras."),
        Item("¿Quién ganó el Mundial de fútbol de 2022?", "Argentina", "Francia", "Croacia", "Brasil", "Fue por penales, en Qatar."),
        Item("¿Qué es depurar con un pato de goma?", "Explicarle el código en voz alta a un pato", "Probar el código bajo el agua", "Borrar líneas hasta que ande", "Pedirle ayuda a un compañero", "Al explicarlo paso a paso, uno suele encontrar el error solo."),
        Item("¿Qué comando de Git crea una rama y se pasa a ella?", "git switch -c", "git branch -m", "git merge -n", "git push -u", "También sirve git checkout -b."),
        Item("¿Cuál de estos lenguajes es el más viejo?", "Fortran", "C", "Pascal", "BASIC", "Fortran es de 1957.")
    )

    fun pick(count: Int, random: Random): Juntada.Quiz {
        val chosen = ALL.shuffled(random).take(count.coerceIn(1, ALL.size))
        return Juntada.Quiz(chosen.map { mix(it.text, listOf(it.right, it.a, it.b, it.c), 0, it.fact, random) }, own = true)
    }

    /** La correcta no queda siempre en el mismo lugar. */
    fun mix(text: String, options: List<String>, correct: Int, fact: String, random: Random): Juntada.Question {
        val order = options.indices.shuffled(random)
        return Juntada.Question(text, order.map { options[it] }, order.indexOf(correct), fact)
    }
}
