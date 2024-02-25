import { Command } from "commander";

const program = new Command()

program
        .option('-d', 'Variable para debug', false)
        .option('-p , --port <port>', 'Puerto del server', 8080) 
        .option('--mode <port>', 'Modo de Uso del Servidor', 'production')
        .option('-u <user>', 'Usuario utilizando server', 'No se declaro usuario')
        .parse()

console.log('Opciones: ', program.opts())