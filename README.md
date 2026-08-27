# TravelLingo Translate

Crie um PWA (Progressive Web App) de tradução multilíngue chamado "TravelLingo" com React + Vite + Tailwind CSS.

LAYOUT PRINCIPAL (mobile-first, tela única):

1. Header:

   - Título "TravelLingo" pequeno no topo

   - Ícone de configurações no canto superior direito (abre modal de gerenciar idiomas baixados)

2. Seletor de idiomas (logo abaixo do header):

   - Dois cards lado a lado: "De" (origem) e "Para" (destino)

   - Cada card é um dropdown com bandeiras + nome do idioma

   - Botão circular no meio dos dois cards com ícone de "trocar" (inverte origem/destino)

   - Incluir opção "Detecção automática" no dropdown de origem, com ícone de radar/sparkles

   - Idiomas iniciais: Português, Inglês, Árabe, Coreano, Japonês

3. Área central (o maior espaço da tela) com 3 abas/tabs:

   - Aba "Texto": campo de texto grande para digitar, com um botão "Traduzir" abaixo. Resultado da tradução aparece em um card abaixo, com ícone de "ouvir" (alto-falante) ao lado

   - Aba "Voz": círculo grande centralizado com ícone de microfone. Ao tocar, deve mudar de cor/pulsar (estado visual de "gravando"). Abaixo dele, texto mostrando o que foi reconhecido em tempo real, e abaixo disso o resultado traduzido, também com ícone de alto-falante

   - Aba "Câmera": botão grande "Tirar foto" que abre a câmera do dispositivo (usar input type=file com capture="environment"), com preview da foto tirada. Abaixo, área mostrando o texto extraído da imagem e sua tradução

4. Indicador de status offline/online:

   - Badge pequeno e discreto no header mostrando "Online" (verde) ou "Offline" (cinza) baseado em navigator.onLine

   - Se um idioma ainda não foi baixado para uso offline, mostrar um badge "Baixar idioma" próximo ao seletor

5. Modal de configurações (idiomas):

   - Lista de idiomas disponíveis, cada um com status "Baixado" ou botão "Baixar" com barra de progresso

   - Indicação de tamanho aproximado de cada modelo (ex: "~80MB")

DESIGN:

- Paleta de cores: tons de azul/verde (transmitir viagem e tranquilidade), fundo claro

- Cantos arredondados, sombras suaves, estilo moderno e limpo

- Ícones da biblioteca lucide-react

- Deve funcionar bem em tela de celular (max-width mobile), mas responsivo

IMPORTANTE:

- Por enquanto, deixe toda a LÓGICA de tradução, reconhecimento de voz e OCR como funções vazias/mockadas (ex: função traduzirTexto(texto) retornando um placeholder), pois vou implementar a integração com modelos locais de IA depois

- Estruture o código em componentes separados (SeletorIdioma, AbaTexto, AbaVoz, AbaCamera, ModalConfiguracoes) para eu conseguir editar cada parte facilmente depois

- Use um Context ou estado global (Zustand ou Context API) para o idioma de origem/destino, compartilhado entre as abas

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://travellingo.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/362f7dd2-4bcf-448d-9403-512df341a933).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
