<template>
  <div id="customize-page" class="container">
    <breadcrumb active="Personalización" />
    <h1>Personalización</h1>
    <section>
      <h2>General</h2>
      <p>
        Mensaje que se muestra siempre en la parte superior de la tienda.
      </p>
      <Input label="Mensaje superior" v-model="globalTopMessage" /> 
      <h2>Menu</h2>
      <div class="menu-grid">
        <div v-for="(item, index) in menu" :key="index" class="item-grid">
          <Input label="Título" v-model="item.text" :error="item.error" help="El título principal, que se muestra arriba de la página." /> 
          <Input label="Link" v-model="item.link" :error="item.error" help="El título principal, que se muestra arriba de la página." /> 
          <button class="remove-item" @click="menu.splice(index, 1)"><i class="bi bi-x-lg"></i></button>
        </div>
        <div>
          <Button @click="menu.push({})">Agregar link</Button>
        </div>
      </div>
    </section>
    <section>
      <h2>Página de inicio</h2>
      <div class="menu-grid">
        <div v-for="(homeCategory, index) in homeCategories" :key="index" class="item-grid">
          <Input label="Categoría" :options="categoryOptions" v-model="homeCategory.category" :error="homeCategory.error" help="El título principal, que se muestra arriba de la página." /> 
          <Input label="Texto alternativo" v-model="homeCategory.alternativeTitle" :error="homeCategory.error" help="El título principal, que se muestra arriba de la página." /> 
          <button class="remove-item" @click="homeCategories.splice(index, 1)"><i class="bi bi-x-lg"></i></button>
        </div>
        <div>
          <Button @click="homeCategories.push({})">Agregar link</Button>
        </div>
      </div>
    </section>
    <Button @click="save" style="margin-top: 40px">Guardar cambios</Button>
  </div>
</template>

<script>
  import Breadcrumb from '../snippets/breadcrumb.snippet.vue'
  import Input from '../snippets/input.snippet.vue'
  import Button from '../snippets/button.snippet.vue'

  import isAdmin from '../../common/utils/isAdmin'

  export default {
    beforeRouteEnter: isAdmin,
    components: {
      Breadcrumb,
      Button,
      Input
    },
    data() {
      return {
        globalTopMessage: '',
        menu: [],
        homeCategories: [],
        categories: [],
      }
    },
    computed: {
      categoryOptions() {
        return this.categories.map(category => ({ text: category.title, value: category.id }))
      }
    },
    async created() {
      const categoryResponse = await this.axios('/categories')
      this.categories = categoryResponse.data.categories

      const mainResponse = await this.axios('/customization')
      const customization = mainResponse.data.customization
      this.globalTopMessage = customization.globalTopMessage 
      this.homeCategories = customization.homeCategories || []
      this.menu = customization.menu
    },
    methods: {
      async save () {
        await this.axios.post('/customization', {
          globalTopMessage: this.globalTopMessage,
          menu: this.menu,
          homeCategories: this.homeCategories
        })
        alert('Cambios guardados')
      }
    }
  }
</script>
