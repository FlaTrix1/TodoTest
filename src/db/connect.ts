import { connect } from "mongoose"

export default (url: string | undefined) => {
	return connect(`${url}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
}
