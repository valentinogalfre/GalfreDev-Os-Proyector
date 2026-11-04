package ar.vale.projectorlauncher

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView

/** Baldosas grandes del hub de apps. */
class HubTileAdapter(private val ctx: Context) : BaseAdapter() {

    private var items: List<AppInfo> = emptyList()
    private var favorites: Set<String> = emptySet()

    fun setItems(list: List<AppInfo>, favs: Set<String>) {
        items = list
        favorites = favs
        notifyDataSetChanged()
    }

    override fun getCount() = items.size
    override fun getItem(position: Int) = items[position]
    override fun getItemId(position: Int) = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val v = convertView ?: LayoutInflater.from(ctx).inflate(R.layout.tile_app_big, parent, false)
        val app = items[position]
        v.findViewById<ImageView>(R.id.tile_icon).setImageDrawable(app.icon)
        v.findViewById<TextView>(R.id.tile_label).text = app.label
        v.findViewById<TextView>(R.id.tile_star).visibility =
            if (favorites.contains(app.packageName)) View.VISIBLE else View.GONE
        return v
    }
}
