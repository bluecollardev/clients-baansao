<template>
  <div>
    <div class="row" v-if="propertiesContent.length > 0">
      <property-block-layout
        v-for="property in propertiesContent.slice(min, max)"
        :key="property.id"
        :className="getPropertyColClass(propertiesContent.slice(min, max).indexOf(property))"
        :title="property.title"
        :description="(property.summary) ? property.summary : ''"
        :link="`/property/${property.id}`"
        linkText="View Property"
        :cloudinaryImage="property.imageId"
        cloudName="baansaowanee"
        :cloudFolder="property.galleryFolder"
        :prices="property.price"
      />
    </div>
  </div>
</template>

<script>
  /**
   :cloudinaryImage="property.imageId"
   cloudName="baansaowanee"
   :cloudFolder="property.galleryFolder"
   :imageAlt="property.caption"
   :prices="property.price"
   */
  import marked from 'marked';

  import PropertyBlockLayout from '~/components/layouts/PropertyBlockLayout.vue';
  import ContentBlockLayout from '~/components/layouts/ContentBlockLayout.vue';

  import ServiceMixin from '~/core/mixins/ServiceMixin';

  // Import static data
  import PropertiesData from '~/data/Properties.yml';

  export default {
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 3
      },
      /**
       * Bootstrap column classes for each item in a row.
       */
      colClass: {
        type: String,
        default: 'col-lg-4 col-md-4 mb-6 project-entry'
      },
      /**
       * Optionally provide an array of classes to be applied,
       * by index, to their corresponding row items.
       */
      itemClass: {
        type: Array,
        default: []
      }
    },
    components: {
      PropertyBlockLayout,
      ContentBlockLayout,
    },
    metaInfo: {
      title: 'Baan Saowanee - Ko Samui, Thailand'
    },
    mixins: [ServiceMixin],
    computed: {
      propertiesContent() {
        const content = this.$static.properties.edges.map(edge => {
          const data = Object.assign({ id: edge.node.id }, edge.node.fields);
          data.summary = (typeof window !== 'undefined') ? marked(data.summary) : data.summary;
          data.description = (typeof window !== 'undefined') ? marked(data.description) : data.description;
          return data;
        });

        return content;
      },
      serviceContent() {
        return PropertiesData;
      }
    },
    data() {
      return {
        //marked: marked
      };
    },
    methods: {
      getPropertyColClass(itemIdx) {
        let classString = (typeof this.colClass === 'string') ? this.colClass : '';
        let classes = (this.itemClass instanceof Array) ? this.itemClass : [];
        if (classes.length > 0 && typeof classes[itemIdx] === 'string') {
          classString += ' ' + classes[itemIdx];
        }

        return classString;
      }
    }
  }
</script>

<static-query>
  query Property {
    properties: allProperty(sortBy: "id", order: DESC) {
      edges {
        node {
          id
          fields {
            image
            imageId
            gallery {
              id
              src
              caption
              #subCaption
              featured
            }
            galleryFolder
            link
            linkText
            title
            metaKeywords
            metaDescription
            price {
              amount
              currency
              dateStart
              dateEnd
              name
            }
            summary
            description
          }
        }
      }
    }
  }
</static-query>
