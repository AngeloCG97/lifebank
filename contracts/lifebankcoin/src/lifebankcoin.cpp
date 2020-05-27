#include <lifebankcoin.hpp>

bool lifebankcoin::is_valid_transaction(const name &from,
                                        const name &to)
{
   lifebanks_table _lifebanks(lifebankcode_account, lifebankcode_account.value);
   auto lifebank_itr_from = _lifebanks.find(from.value);
   auto lifebank_itr_to = _lifebanks.find(to.value);
   // lifebank --> lifebank
   if (lifebank_itr_from != _lifebanks.end() && lifebank_itr_to != _lifebanks.end())
   {
      return true;
   }
   donors_table _donors(lifebankcode_account, lifebankcode_account.value);
   auto donor_itr_to = _donors.find(to.value);
   // lifebank --> doner
   if (lifebank_itr_from != _lifebanks.end() && donor_itr_to != _donors.end())
   {
      return true;
   }
   auto donor_itr_from = _donors.find(from.value);
   sponsors_table _sponsors(lifebankcode_account, lifebankcode_account.value);
   auto sponsor_itr_to = _sponsors.find(to.value);
   // donor --> sponsor
   if (donor_itr_from != _donors.end() && sponsor_itr_to != _sponsors.end())
   {
      return true;
   }
   auto sponsor_itr_from = _sponsors.find(from.value);
   lifebank_itr_to = _lifebanks.find(to.value);
   // sponsor --> lifebank
   if (sponsor_itr_from != _sponsors.end() && lifebank_itr_to != _lifebanks.end())
   {
      return true;
   }
   return false;
}

void lifebankcoin::sub_balance(const name &owner, const asset &value)
{
   accounts from_acnts(get_self(), owner.value);

   const auto &from = from_acnts.get(value.symbol.code().raw(), "no balance object found");
   check(from.balance.amount >= value.amount, "overdrawn balance");

   from_acnts.modify(from, owner, [&](auto &a) {
      a.balance -= value;
   });
}

void lifebankcoin::add_balance(const name &owner, const asset &value, const name &ram_payer)
{
   accounts to_acnts(get_self(), owner.value);
   auto to = to_acnts.find(value.symbol.code().raw());
   if (to == to_acnts.end())
   {
      to_acnts.emplace(ram_payer, [&](auto &a) {
         a.balance = value;
      });
   }
   else
   {
      to_acnts.modify(to, same_payer, [&](auto &a) {
         a.balance += value;
      });
   }
}

ACTION lifebankcoin::create(const name &issuer,
                            const asset &maximum_supply)
{
   require_auth(name("lifebankcode"));
   auto sym = maximum_supply.symbol;
   check(sym.is_valid(), "invalid symbol name");
   check(maximum_supply.is_valid(), "invalid supply");
   check(maximum_supply.amount > 0, "max-supply must be positive");

   stats statstable(get_self(), sym.code().raw());
   auto existing = statstable.find(sym.code().raw());
   check(existing == statstable.end(), "token with symbol already exists");

   statstable.emplace(get_self(), [&](auto &s) {
      s.supply.symbol = maximum_supply.symbol;
      s.max_supply = maximum_supply;
      s.issuer = issuer;
   });
}

ACTION lifebankcoin::issue(const name &to, const asset &quantity, const string &memo)
{
   auto sym = quantity.symbol;
   check(sym.is_valid(), "invalid symbol name");
   check(memo.size() <= 256, "memo has more than 256 bytes");

   stats statstable(get_self(), sym.code().raw());
   auto existing = statstable.find(sym.code().raw());
   check(existing != statstable.end(), "token with symbol does not exist, create token before issue");
   const auto &st = *existing;
   check(to == st.issuer, "tokens can only be issued to issuer account");

   require_auth(st.issuer);
   check(quantity.is_valid(), "invalid quantity");
   check(quantity.amount > 0, "must issue positive quantity");

   check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
   check(quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

   statstable.modify(st, same_payer, [&](auto &s) {
      s.supply += quantity;
   });

   add_balance(st.issuer, quantity, st.issuer);
}

ACTION lifebankcoin::transfer(const name &from,
                              const name &to,
                              const asset &quantity,
                              const string &memo)
{
   check(from != to, "cannot transfer to self");
   require_auth(from);

   check(is_valid_transaction(from, to), "invalid transaction");

   check(is_account(to), "to account does not exist");
   auto sym = quantity.symbol.code();
   stats statstable(get_self(), sym.raw());
   const auto &st = statstable.get(sym.raw());

   require_recipient(from);
   require_recipient(to);

   check(quantity.is_valid(), "invalid quantity");
   check(quantity.amount > 0, "must transfer positive quantity");
   check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
   check(memo.size() <= 256, "memo has more than 256 bytes");

   auto payer = has_auth(to) ? to : from;

   sub_balance(from, quantity);
   add_balance(to, quantity, payer);
}

ACTION consent2life::clear()
{
   require_auth(get_self());
}