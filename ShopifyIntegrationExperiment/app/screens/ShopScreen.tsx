import React, { ComponentType, FC, useMemo } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
  Platform,
  View,
  Image,
  ImageStyle,
  ViewStyle,
} from "react-native"
import {
  $sizeStyles,
  Button,
  ButtonAccessoryProps,
  Card,
  EmptyState,
  Icon,
  ListView,
  Screen,
  Text,
} from "app/components"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useQuery } from "@tanstack/react-query"
import Client, { Product } from "shopify-buy"

import { api } from "app/services/api"
import { delay } from "app/utils/delay"
import { isRTL, translate } from "app/i18n"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import { colors, spacing } from "app/theme"
import { ContentStyle } from "@shopify/flash-list"

const ICON_SIZE = 14

const shopifyClient = Client.buildClient({
  apiVersion: "2024-01",
  domain: "quickstart-e15784b0.myshopify.com",
  storefrontAccessToken: "9ca2e67a4047f3ab28947b784f338ce7",
})

interface ShopScreenProps extends DemoTabScreenProps<"Shop"> {}

export const ShopScreen: FC<ShopScreenProps> = () => {
  const episodesQuery = useQuery({
    queryKey: ["episodes"],
    queryFn: async () => {
      const response = await api.getEpisodes()
      if (response.kind === "ok") {
        return response.episodes
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
        throw new Error(response.kind)
      }
    },
  })
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        return shopifyClient.product.fetchAll()
      } catch (error) {
        console.error(`Error fetching products: ${JSON.stringify(error)}`)
        throw error
      }
    },
  })

  const [refreshing, setRefreshing] = React.useState(false)
  const products = productsQuery.data ?? []

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([episodesQuery.refetch(), delay(750)])
    setRefreshing(false)
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <ListView<Product>
        contentContainerStyle={$listContentContainer}
        data={products}
        refreshing={refreshing}
        estimatedItemSize={177}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          episodesQuery.isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="demoPodcastListScreen.title" />
          </View>
        }
        renderItem={({ item }) => <ProductsCard product={item} />}
      />
    </Screen>
  )
}

function ProductsCard({ product }: { product: Product }) {
  /**
   * Android has a "longpress" accessibility action. iOS does not, so we just have to use a hint.
   * @see https://reactnative.dev/docs/accessibility#accessibilityactions
   */
  const accessibilityHintProps = useMemo(
    () =>
      Platform.select<AccessibilityProps>({
        ios: {
          accessibilityLabel: product.title,
          accessibilityHint: translate("demoPodcastListScreen.accessibility.cardHint", {
            action: "buy",
          }),
        },
        android: {
          accessibilityLabel: product.title,
          accessibilityActions: [
            {
              name: "longpress",
              label: translate("demoPodcastListScreen.accessibility.favoriteAction"),
            },
          ],
          onAccessibilityAction: ({ nativeEvent }) => {
            if (nativeEvent.actionName === "longpress") {
              handlePressBuy()
            }
          },
        },
      }),
    [product],
  )

  const handlePressCard = () => {
    // onlineStoreUrl is null for development stores
    // product.onlineStoreUrl && openLinkInBrowser(product.onlineStoreUrl)
    openLinkInBrowser("https://quickstart-e15784b0.myshopify.com/products/selling-plans-ski-wax")
  }
  const handlePressBuy = async () => {
    // previously created checkout - https://quickstart-e15784b0.myshopify.com/64111280317/checkouts/e343fa840a1feed02a14c98b7e39ee07?key=63ef3219f9fcf949c7c53a6d4daf83c0

    console.log(
      "creating checkout",
      product.variants.length > 0 ? product.variants[0].id : product.id,
    )

    // const checkout = await shopifyClient.checkout.create()
    // await shopifyClient.checkout.addLineItems(checkout.id, [
    //   { variantId: product.variants.length > 0 ? product.variants[0].id : product.id, quantity: 1 },
    // ])
    // openLinkInBrowser(checkout.webUrl)
  }

  const ButtonLeftAccessory: ComponentType<ButtonAccessoryProps> = useMemo(
    () =>
      function ButtonLeftAccessory() {
        return (
          <View style={$iconContainer}>
            <Icon
              icon="heart"
              size={ICON_SIZE}
              color={colors.palette.neutral800} // dark grey
            />
          </View>
        )
      },
    [],
  )

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      onLongPress={handlePressBuy}
      content={product.title}
      contentStyle={{ fontSize: $sizeStyles.lg.fontSize }}
      {...accessibilityHintProps}
      RightComponent={
        product.images.length > 0 ? (
          <Image source={{ uri: product.images[0].src }} style={$itemThumbnail} />
        ) : undefined
      }
      FooterComponent={
        <Button
          onPress={handlePressBuy}
          onLongPress={handlePressBuy}
          style={$favoriteButton}
          accessibilityLabel={translate("demoPodcastListScreen.accessibility.favoriteIcon")}
          LeftAccessory={ButtonLeftAccessory}
        >
          <Text size="xxs" weight="medium" text="Buy" />
        </Button>
      }
    />
  )
}

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.sm,
  height: 150,
  aspectRatio: 1,
  resizeMode: "cover",
  borderRadius: 50,
  alignSelf: "flex-start",
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginEnd: spacing.xs,
}

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.md,
  justifyContent: "flex-start",
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xxxs,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
